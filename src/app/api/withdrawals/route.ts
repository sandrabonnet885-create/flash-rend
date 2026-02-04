import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId: clerkUserId } = getAuth(req as any);
        if (!clerkUserId) {
            return new NextResponse("Non autorisé", { status: 401 });
        }

        const { amount, bankAccountId } = await req.json();

        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 },
            );
        }

        // Vérifier le solde
        if (user.balance < amount) {
            return NextResponse.json(
                { error: "Solde insuffisant" },
                { status: 400 },
            );
        }

        // Vérifier que le compte bancaire appartient bien à l'utilisateur
        const bankAccount = await prisma.bankAccount.findFirst({
            where: {
                id: bankAccountId,
                userId: user.id,
            },
        });

        if (!bankAccount) {
            return NextResponse.json(
                { error: "Compte bancaire non trouvé" },
                { status: 404 },
            );
        }

        // Créer la transaction de retrait
        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: -amount, // Montant négatif pour un retrait
                type: "WITHDRAWAL",
                status: "PENDING",
                description: "Demande de retrait",
                bankAccountId: bankAccountId,
            },
        });

        // Mettre à jour le solde
        await prisma.user.update({
            where: { id: user.id },
            data: {
                balance: {
                    decrement: amount,
                },
            },
        });

        // Ici, vous pourriez ajouter une logique pour envoyer l'argent via Stripe Connect
        // ou une autre API bancaire

        return NextResponse.json({
            success: true,
            transaction,
            newBalance: user.balance - amount,
        });
    } catch (error) {
        console.error("Withdrawal error:", error);
        return NextResponse.json(
            { error: "Erreur lors du traitement du retrait" },
            { status: 500 },
        );
    }
}
