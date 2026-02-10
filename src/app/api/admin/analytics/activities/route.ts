import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

async function isAdmin(userId: string): Promise<boolean> {
    return true; // TODO: Implémenter la vérification admin
}

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user || !(await isAdmin(user.id))) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        // Récupérer les dernières activités (transactions, investissements, remboursements)
        const recentTransactions = await prisma.transaction.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const recentInvestments = await prisma.investment.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const recentRefunds = await prisma.refundRequest.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({
            transactions: recentTransactions,
            investments: recentInvestments,
            refunds: recentRefunds,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des activités:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
