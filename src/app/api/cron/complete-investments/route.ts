import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInvestmentCompletedEmail } from "@/lib/email";

export async function GET(request: Request) {
    try {
        // Vérifier l'autorisation (secret token pour les cron jobs)
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const now = new Date();

        // Trouver les investissements terminés qui n'ont pas encore été crédités
        const completedInvestments = await prisma.investment.findMany({
            where: {
                status: "ACTIVE",
                endsAt: {
                    lte: now,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        let processedCount = 0;
        const errors: string[] = [];

        // Traiter chaque investissement terminé
        for (const investment of completedInvestments) {
            try {
                // Créditer le compte utilisateur et mettre à jour le statut
                await prisma.$transaction(async (tx) => {
                    // Créditer le compte
                    await tx.user.update({
                        where: { id: investment.userId },
                        data: {
                            balance: {
                                increment: investment.potentialReturn,
                            },
                        },
                    });

                    // Marquer l'investissement comme complété
                    await tx.investment.update({
                        where: { id: investment.id },
                        data: { status: "COMPLETED" },
                    });

                    // Créer une transaction pour le retour
                    await tx.transaction.create({
                        data: {
                            userId: investment.userId,
                            amount: investment.potentialReturn,
                            type: "DIVIDEND",
                            status: "COMPLETED",
                            description: `Retour investissement #${investment.id.slice(-4)}`,
                            currency: "EUR",
                        },
                    });
                });

                // Envoyer l'email de notification
                try {
                    await sendInvestmentCompletedEmail(
                        {
                            email: investment.user.email,
                            firstName: investment.user.firstName,
                            lastName: investment.user.lastName,
                        },
                        {
                            id: investment.id,
                            amount: investment.amount,
                            multiplier: investment.multiplier,
                            potentialReturn: investment.potentialReturn,
                            endsAt: investment.endsAt,
                        }
                    );
                } catch (emailError) {
                    console.error(
                        `Error sending completion email for investment ${investment.id}:`,
                        emailError
                    );
                    // Continue même si l'email échoue
                }

                processedCount++;
            } catch (error) {
                console.error(
                    `Error processing investment ${investment.id}:`,
                    error
                );
                errors.push(investment.id);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${processedCount} completed investments`,
            totalInvestments: completedInvestments.length,
            processedCount,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Error in complete-investments cron:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
