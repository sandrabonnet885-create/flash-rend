import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { sendDepositSubmittedEmail, sendAdminDepositNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { amount, reference, transferDate, proofUrl } = body;

        // Validation
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Montant invalide" },
                { status: 400 }
            );
        }

        if (!reference || reference.trim() === "") {
            return NextResponse.json(
                { error: "Référence de transaction requise" },
                { status: 400 }
            );
        }

        if (!transferDate) {
            return NextResponse.json(
                { error: "Date de virement requise" },
                { status: 400 }
            );
        }

        // Récupérer l'utilisateur dans la base
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Créer la demande de dépôt
        const deposit = await prisma.bankTransferDeposit.create({
            data: {
                userId: dbUser.id,
                amount: parseFloat(amount),
                reference: reference.trim(),
                transferDate: new Date(transferDate),
                proofUrl: proofUrl || null,
                status: "PENDING",
            },
        });

        // Envoyer les emails de notification
        try {
            await sendDepositSubmittedEmail(
                {
                    email: dbUser.email,
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                },
                {
                    id: deposit.id,
                    amount: deposit.amount,
                    reference: deposit.reference,
                    transferDate: deposit.transferDate,
                }
            );

            await sendAdminDepositNotification(
                {
                    email: dbUser.email,
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                },
                {
                    id: deposit.id,
                    amount: deposit.amount,
                    reference: deposit.reference,
                    transferDate: deposit.transferDate,
                }
            );
        } catch (emailError) {
            console.error("Error sending deposit emails:", emailError);
            // Continue même si l'email échoue
        }

        return NextResponse.json({
            success: true,
            deposit,
            message: "Demande de dépôt soumise avec succès",
        });
    } catch (error) {
        console.error("Error submitting bank transfer:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
