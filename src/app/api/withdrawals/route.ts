import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
    sendWithdrawalRequestedEmail,
    sendAdminWithdrawalNotification,
} from "@/lib/email";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { amount, bankAccountId } = body;

        if (!amount || amount < 1) {
            return new NextResponse("Invalid amount (min 1€)", { status: 400 });
        }

        if (!bankAccountId) {
            return new NextResponse("Bank account required", { status: 400 });
        }

        // 1. Get User and verify balance
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        if (dbUser.balance < amount) {
            return new NextResponse("Solde suffisant", { status: 400 });
        }

        // --- Nouvelles contraintes de retrait ---

        // 1. Compter les retraits précédents (réussis ou en attente)
        const previousWithdrawalsCount = await prisma.transaction.count({
            where: {
                userId: dbUser.id,
                type: "WITHDRAWAL",
                status: { not: "FAILED" },
            },
        });

        if (previousWithdrawalsCount === 0) {
            // Premier retrait : limité au gain du premier investissement (max 5€)
            const firstInvestment = await prisma.investment.findFirst({
                where: { userId: dbUser.id },
                orderBy: { createdAt: "asc" },
            });

            if (!firstInvestment) {
                return new NextResponse("Aucun investissement trouvé", {
                    status: 400,
                });
            }

            if (firstInvestment.status !== "COMPLETED") {
                return new NextResponse(
                    "Votre premier investissement n'est pas encore terminé",
                    { status: 400 },
                );
            }

            const gain =
                firstInvestment.potentialReturn - firstInvestment.amount;
            const limit = Math.min(gain, 5);

            if (amount > limit) {
                return new NextResponse(
                    `Le premier retrait est limité à ${limit.toFixed(2)}€ (gain de votre investissement bonus capped à 5€)`,
                    { status: 400 },
                );
            }
        } else {
            // Deuxième retrait ou plus : possible uniquement si au moins un dépôt a été fait
            const completedDepositsCount = await prisma.transaction.count({
                where: {
                    userId: dbUser.id,
                    type: "DEPOSIT",
                    status: "COMPLETED",
                },
            });

            if (completedDepositsCount === 0) {
                return new NextResponse(
                    "Vous devez effectuer au moins un dépôt pour débloquer les retraits suivants",
                    { status: 400 },
                );
            }
        }
        // ----------------------------------------

        // 2. Create Transaction (WITHDRAWAL, PENDING)
        // We use a transaction to ensure balance is not deducted yet OR deducted immediately?
        // Usually for withdrawals, we deduct immediately to prevent double spend,
        // OR we just check it and deduct when approved.
        // Let's deduct immediately to be safe "Reserved funds".
        // If rejected, we refund.

        const newBalance = dbUser.balance - amount;

        const result = await prisma.$transaction(async (tx) => {
            // Deduct balance
            await tx.user.update({
                where: { id: dbUser.id },
                data: { balance: newBalance },
            });

            // Create Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId: dbUser.id,
                    amount: amount,
                    type: "WITHDRAWAL",
                    status: "PENDING",
                    description: "Retrait vers compte bancaire",
                    currency: "EUR",
                    bankAccountId: bankAccountId,
                },
            });

            return transaction;
        });

        // Envoyer les emails de notification
        try {
            await sendWithdrawalRequestedEmail(
                {
                    email: dbUser.email,
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                },
                {
                    id: result.id,
                    amount: result.amount,
                },
            );

            await sendAdminWithdrawalNotification(
                {
                    email: dbUser.email,
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                },
                {
                    id: result.id,
                    amount: result.amount,
                },
            );
        } catch (emailError) {
            console.error("Error sending withdrawal emails:", emailError);
            // Continue même si l'email échoue
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("[WITHDRAWALS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
