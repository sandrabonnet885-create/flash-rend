import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { sendDepositApprovedEmail, sendDepositRejectedEmail } from "@/lib/email";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

async function isAdmin(userEmail: string | null): Promise<boolean> {
    if (!userEmail) return false;
    return ADMIN_EMAILS.includes(userEmail);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress ?? null;
        if (!user || !(await isAdmin(userEmail))) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status, adminNote } = body;

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json(
                { error: "Statut invalide" },
                { status: 400 }
            );
        }

        const deposit = await prisma.bankTransferDeposit.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!deposit) {
            return NextResponse.json(
                { error: "Dépôt non trouvé" },
                { status: 404 }
            );
        }

        if (deposit.status !== "PENDING") {
            return NextResponse.json(
                { error: "Ce dépôt a déjà été traité" },
                { status: 400 }
            );
        }

        // Mettre à jour le dépôt
        const updatedDeposit = await prisma.bankTransferDeposit.update({
            where: { id },
            data: {
                status,
                adminNote: adminNote || null,
                processedBy: userEmail,
                processedAt: new Date(),
            },
        });

        // Si approuvé, créditer le compte utilisateur
        if (status === "APPROVED") {
            await prisma.user.update({
                where: { id: deposit.userId },
                data: {
                    balance: {
                        increment: deposit.amount,
                    },
                },
            });

            // Créer une transaction
            await prisma.transaction.create({
                data: {
                    userId: deposit.userId,
                    amount: deposit.amount,
                    type: "DEPOSIT",
                    status: "COMPLETED",
                    description: `Dépôt par virement bancaire - Ref: ${deposit.reference}`,
                    reference: `BANK_TRANSFER_${deposit.id}`,
                },
            });
        }

        // Envoyer l'email de notification
        try {
            const userInfo = {
                email: deposit.user.email,
                firstName: deposit.user.firstName,
                lastName: deposit.user.lastName,
            };

            const depositInfo = {
                id: deposit.id,
                amount: deposit.amount,
                reference: deposit.reference,
                transferDate: deposit.transferDate,
                adminNote: adminNote || null,
            };

            if (status === "APPROVED") {
                await sendDepositApprovedEmail(userInfo, depositInfo);
            } else {
                await sendDepositRejectedEmail(userInfo, depositInfo);
            }
        } catch (emailError) {
            console.error("Error sending deposit status email:", emailError);
            // Continue même si l'email échoue
        }

        return NextResponse.json({
            success: true,
            deposit: updatedDeposit,
            message:
                status === "APPROVED"
                    ? "Dépôt approuvé et compte crédité"
                    : "Dépôt rejeté",
        });
    } catch (error) {
        console.error("Error processing bank transfer:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
