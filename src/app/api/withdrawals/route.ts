import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
            return new NextResponse("Insufficient funds", { status: 400 });
        }

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

        return NextResponse.json(result);
    } catch (error) {
        console.error("[WITHDRAWALS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
