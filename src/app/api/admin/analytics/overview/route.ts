import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// TODO: Ajouter une vérification des permissions admin
async function isAdmin(userId: string): Promise<boolean> {
    // Pour l'instant, retourne true
    // À implémenter: vérifier si l'utilisateur a le rôle admin
    return true;
}

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Vérifier les permissions admin
        const adminCheck = await isAdmin(user.id);
        if (!adminCheck) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Récupérer les statistiques générales
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Utilisateurs
        const totalUsers = await prisma.user.count();
        const newUsersToday = await prisma.user.count({
            where: { createdAt: { gte: today } },
        });
        const newUsersThisWeek = await prisma.user.count({
            where: { createdAt: { gte: thisWeek } },
        });
        const newUsersThisMonth = await prisma.user.count({
            where: { createdAt: { gte: thisMonth } },
        });

        // Investissements
        const totalInvestments = await prisma.investment.count();
        const activeInvestments = await prisma.investment.count({
            where: { status: "ACTIVE" },
        });
        const completedInvestments = await prisma.investment.count({
            where: { status: "COMPLETED" },
        });

        const investmentStats = await prisma.investment.aggregate({
            _sum: {
                amount: true,
                potentialReturn: true,
            },
        });

        // Transactions
        const totalTransactions = await prisma.transaction.count();
        const pendingTransactions = await prisma.transaction.count({
            where: { status: "PENDING" },
        });

        const transactionStats = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { status: "COMPLETED" },
        });

        const depositsToday = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                type: "DEPOSIT",
                status: "COMPLETED",
                createdAt: { gte: today },
            },
        });

        const withdrawalsToday = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                type: "WITHDRAWAL",
                status: "COMPLETED",
                createdAt: { gte: today },
            },
        });

        // Demandes de remboursement
        const totalRefundRequests = await prisma.refundRequest.count();
        const pendingRefunds = await prisma.refundRequest.count({
            where: { status: "PENDING" },
        });
        const approvedRefunds = await prisma.refundRequest.count({
            where: { status: "APPROVED" },
        });
        const rejectedRefunds = await prisma.refundRequest.count({
            where: { status: "REJECTED" },
        });

        const refundStats = await prisma.refundRequest.aggregate({
            _sum: { amount: true },
        });

        // Calculer le solde total de tous les utilisateurs
        const userBalances = await prisma.user.aggregate({
            _sum: { balance: true },
        });

        return NextResponse.json({
            users: {
                total: totalUsers,
                newToday: newUsersToday,
                newThisWeek: newUsersThisWeek,
                newThisMonth: newUsersThisMonth,
                totalBalance: userBalances._sum.balance || 0,
            },
            investments: {
                total: totalInvestments,
                active: activeInvestments,
                completed: completedInvestments,
                totalAmount: investmentStats._sum.amount || 0,
                totalPotentialReturn: investmentStats._sum.potentialReturn || 0,
            },
            transactions: {
                total: totalTransactions,
                pending: pendingTransactions,
                totalVolume: transactionStats._sum.amount || 0,
                depositsToday: depositsToday._sum.amount || 0,
                withdrawalsToday: withdrawalsToday._sum.amount || 0,
            },
            refunds: {
                total: totalRefundRequests,
                pending: pendingRefunds,
                approved: approvedRefunds,
                rejected: rejectedRefunds,
                totalAmount: refundStats._sum.amount || 0,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des analytics:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
