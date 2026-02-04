import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { z } from "zod";

// Schémas de validation
const withdrawalSchema = z.object({
    amount: z
        .number()
        .positive("Le montant doit être positif")
        .min(1, "Montant minimum: 1€")
        .max(50000, "Montant maximum: 50000€"),
    bankAccountId: z.string().min(1, "ID du compte bancaire requis"),
});

type WithdrawalInput = z.infer<typeof withdrawalSchema>;

const MIN_WITHDRAWAL = 10; // Montant minimum de retrait
const MAX_WITHDRAWAL = 50000; // Montant maximum de retrait

// POST /api/withdrawals - Créer une demande de retrait
export async function POST(req: Request) {
    try {
        const { userId: clerkUserId } = getAuth(req as any);

        if (!clerkUserId) {
            console.warn("[API] Unauthorized withdrawal attempt");
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 },
            );
        }

        // Parser et valider le body
        const body = await req.json();
        const validatedData = withdrawalSchema.parse(body);
        const { amount, bankAccountId } = validatedData;

        console.log(
            `[API] Processing withdrawal for Clerk ID: ${clerkUserId}`,
            `Amount: ${amount}€`,
        );

        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
        });

        if (!user) {
            console.warn(`[API] User not found with Clerk ID: ${clerkUserId}`);
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 },
            );
        }

        // Vérifier le montant minimum
        if (amount < MIN_WITHDRAWAL) {
            console.warn(
                `[API] Withdrawal amount below minimum: ${amount}€ < ${MIN_WITHDRAWAL}€`,
            );
            return NextResponse.json(
                {
                    error: `Montant minimum de retrait: ${MIN_WITHDRAWAL}€`,
                },
                { status: 400 },
            );
        }

        // Vérifier le solde
        if (user.balance < amount) {
            console.warn(
                `[API] Insufficient balance for user ${user.id}: ${user.balance}€ < ${amount}€`,
            );
            return NextResponse.json(
                {
                    error: `Solde insuffisant (Solde: ${user.balance}€)`,
                    currentBalance: user.balance,
                },
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
            console.warn(
                `[API] Bank account not found: ${bankAccountId} for user ${user.id}`,
            );
            return NextResponse.json(
                { error: "Compte bancaire non trouvé" },
                { status: 404 },
            );
        }

        // Créer la transaction de retrait dans une transaction DB
        const transaction = await prisma.$transaction(async (tx) => {
            // Créer la transaction de retrait
            const withdrawalTransaction = await tx.transaction.create({
                data: {
                    userId: user.id,
                    amount, // Montant positif
                    currency: "EUR",
                    type: "WITHDRAWAL",
                    status: "PENDING",
                    description: "Demande de retrait vers compte bancaire",
                    bankAccountId: bankAccountId,
                    metadata: {
                        bankName: bankAccount.bankName,
                        accountHolder: bankAccount.accountHolder,
                        iban: bankAccount.iban.slice(-4), // Ne stocker que les 4 derniers caractères
                        requestedAt: new Date().toISOString(),
                    } as any,
                },
            });

            // Mettre à jour le solde (décrémenter)
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });

            console.log(
                `[API] ✅ Withdrawal created for user ${user.id}`,
                `Amount: ${amount}€, New balance: ${updatedUser.balance}€`,
            );

            return { transaction: withdrawalTransaction, updatedUser };
        });

        return NextResponse.json({
            success: true,
            message: "Demande de retrait créée avec succès",
            transaction: transaction.transaction,
            newBalance: transaction.updatedUser.balance,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.warn("[API] Validation error:", error.issues);
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: error.issues.map((e) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                },
                { status: 400 },
            );
        }

        console.error("[API] ❌ Error processing withdrawal:", error);
        return NextResponse.json(
            { error: "Erreur lors du traitement du retrait" },
            { status: 500 },
        );
    }
}
