import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sendWithdrawalApprovedEmail, sendWithdrawalRejectedEmail } from "@/lib/email";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userEmail = user.emailAddresses[0]?.emailAddress;
        if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, adminNote } = body;

        if (!["COMPLETED", "FAILED"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!transaction) {
            return new NextResponse("Transaction not found", { status: 404 });
        }

        if (transaction.status !== "PENDING") {
            return new NextResponse("Transaction already processed", { status: 400 });
        }

        if (status === "COMPLETED") {
            // Just mark as completed, money was already deducted
            await prisma.transaction.update({
                where: { id },
                data: { status: "COMPLETED" },
            });
        } else if (status === "FAILED") {
            // Refund the user using a transaction
            await prisma.$transaction(async (tx) => {
                // Update original transaction
                await tx.transaction.update({
                    where: { id },
                    data: { status: "FAILED" }, // Or REJECTED if enum allows, using FAILED for now
                });

                // Refund balance
                const currentBalance = transaction.user.balance;
                await tx.user.update({
                    where: { id: transaction.userId },
                    data: { balance: currentBalance + transaction.amount },
                });
            });
        }

        // Envoyer l'email de notification
        try {
            const userInfo = {
                email: transaction.user.email,
                firstName: transaction.user.firstName,
                lastName: transaction.user.lastName,
            };

            const withdrawalInfo = {
                id: transaction.id,
                amount: transaction.amount,
                adminNote: adminNote || null,
            };

            if (status === "COMPLETED") {
                await sendWithdrawalApprovedEmail(userInfo, withdrawalInfo);
            } else {
                await sendWithdrawalRejectedEmail(userInfo, withdrawalInfo);
            }
        } catch (emailError) {
            console.error("Error sending withdrawal status email:", emailError);
            // Continue même si l'email échoue
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_WITHDRAWAL_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
