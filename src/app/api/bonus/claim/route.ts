import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) return new NextResponse("User not found", { status: 404 });

        // Check if bonus already claimed
        if (dbUser.bonusClaimed) {
            return new NextResponse("Bonus already claimed", { status: 400 });
        }

        const BONUS_AMOUNT = 0.5;

        // Credit bonus and mark as claimed
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Update user balance and bonus status
            const user = await tx.user.update({
                where: { id: dbUser.id },
                data: {
                    balance: { increment: BONUS_AMOUNT },
                    bonusClaimed: true,
                },
            });

            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: dbUser.id,
                    amount: BONUS_AMOUNT,
                    type: "BONUS",
                    status: "COMPLETED",
                    description: "Bonus de test de bienvenue",
                    currency: "EUR",
                },
            });

            return user;
        });

        return NextResponse.json({
            success: true,
            newBalance: updatedUser.balance,
        });
    } catch (error) {
        console.error("[BONUS_CLAIM_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
