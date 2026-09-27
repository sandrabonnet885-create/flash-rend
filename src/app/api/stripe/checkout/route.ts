import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, formatAmountForDisplay } from "@/lib/stripe";

const MAX_AMOUNT_CENTS = 500000; // 5000€ en centimes
const MIN_AMOUNT_CENTS = 100; // 1€ en centimes

// Convertir en euros pour la validation
const MAX_AMOUNT_EUR = MAX_AMOUNT_CENTS / 100; // 5000€
const MIN_AMOUNT_EUR = MIN_AMOUNT_CENTS / 100; // 1€

export async function POST(request: NextRequest) {
    try {
        const { amount, userEmail, userId } = await request.json();

        // Validation des entrées
        if (!amount || isNaN(amount) || amount < 1) {
            return NextResponse.json(
                { error: "Montant invalide" },
                { status: 400 }
            );
        }

        if (amount < MIN_AMOUNT_EUR) {
            return NextResponse.json(
                {
                    error: `Le montant minimum est de ${formatAmountForDisplay(
                        MIN_AMOUNT_CENTS,
                        "eur"
                    )}`,
                },
                { status: 400 }
            );
        }

        if (amount > MAX_AMOUNT_EUR) {
            return NextResponse.json(
                {
                    error: `Le montant maximum est de ${formatAmountForDisplay(
                        MAX_AMOUNT_CENTS,
                        "eur"
                    )}`,
                },
                { status: 400 }
            );
        }

        if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
            return NextResponse.json(
                { error: "Email utilisateur invalide" },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: "ID utilisateur manquant" },
                { status: 400 }
            );
        }

        // Créer la session de paiement
        const session = await createCheckoutSession(
            {
                payment_method_types: ["card"],
                customer_email: userEmail,
                client_reference_id: userId,
                line_items: [
                    {
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name: "Crédit FlashRend",
                                description: `Crédit de ${amount}€ pour votre compte FlashRend`,
                            },
                            unit_amount: Math.round(amount * 100), // Convertir en centimes
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId,
                    amount: amount.toString(),
                    timestamp: new Date().toISOString(),
                },
                payment_intent_data: {
                    metadata: {
                        userId,
                        amount: amount.toString(),
                        description: `Crédit FlashRend - ${amount}€`,
                    },
                },
            },
            request.url // Passer l'URL de la requête pour détecter le domaine
        );

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error(
            "Erreur lors de la création de la session de paiement:",
            error
        );

        // Gestion des erreurs spécifiques à Stripe
        if (error instanceof Error && "code" in error) {
            switch (error.code) {
                case "resource_missing":
                    return NextResponse.json(
                        {
                            error: "Ressource manquante pour le traitement du paiement",
                        },
                        { status: 400 }
                    );
                case "authentication_required":
                    return NextResponse.json(
                        { error: "Authentification requise" },
                        { status: 401 }
                    );
                case "rate_limit":
                    return NextResponse.json(
                        {
                            error: "Trop de requêtes, veuillez réessayer plus tard",
                        },
                        { status: 429 }
                    );
            }
        }

        // Erreur générique
        return NextResponse.json(
            {
                error: "Une erreur est survenue lors du traitement de votre demande",
            },
            { status: 500 }
        );
    }
}

// Désactiver le cache pour cette route
export const dynamic = "force-dynamic";
