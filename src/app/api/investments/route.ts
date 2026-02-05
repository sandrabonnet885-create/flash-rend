import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return new NextResponse("Invalid amount", { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) return new NextResponse("User not found", { status: 404 });

        if (dbUser.balance < amount) {
            return new NextResponse("Insufficient funds", { status: 400 });
        }

        // Random multiplier between 9 and 10
        const multiplier = Math.random() * (10 - 9) + 9;
        const potentialReturn = amount * multiplier;

        // Random duration between 20 and 30 minutes in milliseconds
        const minDuration = 20 * 60 * 1000;
        const maxDuration = 30 * 60 * 1000;
        const duration =
            Math.floor(Math.random() * (maxDuration - minDuration + 1)) +
            minDuration;
        const endsAt = new Date(Date.now() + duration);

        const investment = await prisma.$transaction(async (tx) => {
            // Deduct balance
            await tx.user.update({
                where: { id: dbUser.id },
                data: { balance: { decrement: amount } },
            });

            // Create Investment
            const newInvestment = await tx.investment.create({
                data: {
                    userId: dbUser.id,
                    amount,
                    multiplier,
                    potentialReturn,
                    endsAt,
                    status: "ACTIVE",
                },
            });

            // Create Transaction record for the investment deduction
            await tx.transaction.create({
                data: {
                    userId: dbUser.id,
                    amount: amount,
                    type: "INVESTMENT",
                    status: "COMPLETED",
                    description: `Investissement #${newInvestment.id.slice(-4)}`,
                    currency: "EUR",
                },
            });

            return newInvestment;
        });

        return NextResponse.json(investment);
    } catch (error) {
        console.error("[INVESTMENT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await currentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) return new NextResponse("User not found", { status: 404 });


        // Lazy Evaluation: Check for completed investments
        const now = new Date();
        console.log("[INVESTMENT_GET] Checking for completed investments at:", now);
        
        const pendingInvestments = await prisma.investment.findMany({
            where: {
                userId: dbUser.id,
                status: "ACTIVE",
                endsAt: { lte: now },
            },
        });

        console.log("[INVESTMENT_GET] Found", pendingInvestments.length, "completed investments to process");

        if (pendingInvestments.length > 0) {
            await prisma.$transaction(async (tx) => {
                for (const inv of pendingInvestments) {
                    console.log(`[INVESTMENT_GET] Processing investment ${inv.id}, crediting ${inv.potentialReturn}€`);
                    
                    // Mark as COMPLETED
                    await tx.investment.update({
                        where: { id: inv.id },
                        data: { status: "COMPLETED" },
                    });

                    // Credit User
                    await tx.user.update({
                        where: { id: dbUser.id },
                        data: { balance: { increment: inv.potentialReturn } },
                    });

                    // Create Transaction (Dividend/Return)
                    await tx.transaction.create({
                        data: {
                            userId: dbUser.id,
                            amount: inv.potentialReturn,
                            type: "DIVIDEND",
                            status: "COMPLETED",
                            description: `Retour Investissement #${inv.id.slice(
                                -4
                            )}`,
                            currency: "EUR",
                        },
                    });
                    
                    console.log(`[INVESTMENT_GET] Successfully credited investment ${inv.id}`);
                }
            });
            
            console.log("[INVESTMENT_GET] All completed investments processed successfully");
        }


        // Fetch valid list (freshly updated)
        const investments = await prisma.investment.findMany({
            where: { user: { clerkId: user.id } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(investments);
    } catch (error) {
        console.error("[INVESTMENT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
