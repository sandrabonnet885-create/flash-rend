import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const user = await currentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) return new NextResponse("User not found", { status: 404 });

        // Count previous withdrawals
        const previousWithdrawalsCount = await prisma.transaction.count({
            where: {
                userId: dbUser.id,
                type: "WITHDRAWAL",
                status: { not: "FAILED" },
            },
        });

        // Count completed deposits
        const completedDepositsCount = await prisma.transaction.count({
            where: {
                userId: dbUser.id,
                type: "DEPOSIT",
                status: "COMPLETED",
            },
        });

        // First investment info
        const firstInvestment = await prisma.investment.findFirst({
            where: { userId: dbUser.id },
            orderBy: { createdAt: "asc" },
        });

        let firstWithdrawalLimit = null;
        if (
            previousWithdrawalsCount === 0 &&
            firstInvestment &&
            firstInvestment.status === "COMPLETED"
        ) {
            const gain =
                firstInvestment.potentialReturn - firstInvestment.amount;
            firstWithdrawalLimit = Math.min(gain, 5);
        }

        return NextResponse.json({
            previousWithdrawalsCount,
            completedDepositsCount,
            firstWithdrawalLimit,
            isEligible:
                previousWithdrawalsCount === 0
                    ? firstInvestment?.status === "COMPLETED"
                    : completedDepositsCount > 0,
            reason:
                previousWithdrawalsCount === 0
                    ? firstInvestment
                        ? firstInvestment.status === "COMPLETED"
                            ? null
                            : "Votre premier investissement doit être terminé"
                        : "Aucun investissement trouvé"
                    : completedDepositsCount > 0
                      ? null
                      : "Vous devez effectuer un dépôt pour débloquer les retraits suivants",
        });
    } catch (error) {
        console.error("[WITHDRAWAL_STATUS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
