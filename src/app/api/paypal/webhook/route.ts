import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CURRENCY = "EUR";

/**
 * Webhook PayPal pour gérer les événements de paiement asynchrones.
 *
 * NOTE SÉCURITÉ : En production, PayPal nécessite une vérification de signature.
 * Ajoutez la variable d'environnement PAYPAL_WEBHOOK_ID et implémentez la
 * vérification via l'API PayPal Webhooks : POST /v1/notifications/verify-webhook-signature
 *
 * Événements traités :
 * - PAYMENT.CAPTURE.COMPLETED  → Crédit du solde utilisateur si pas déjà fait
 * - PAYMENT.CAPTURE.DENIED     → Journalisation de l'échec
 * - PAYMENT.CAPTURE.REVERSED   → Débit du remboursement
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const eventType = body.event_type;
        const resource = body.resource;

        console.log(`[PAYPAL_WEBHOOK] Event received: ${eventType}`);

        switch (eventType) {
            case "PAYMENT.CAPTURE.COMPLETED": {
                await handleCaptureCompleted(resource);
                break;
            }
            case "PAYMENT.CAPTURE.DENIED": {
                console.warn(
                    `[PAYPAL_WEBHOOK] Capture DENIED for resource ${resource?.id}`,
                );
                // Journaliser pour investigation manuelle
                break;
            }
            case "PAYMENT.CAPTURE.REVERSED": {
                await handleCaptureReversed(resource);
                break;
            }
            default:
                console.log(
                    `[PAYPAL_WEBHOOK] Unhandled event type: ${eventType}`,
                );
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("[PAYPAL_WEBHOOK] Error processing webhook:", error);
        // Retourner 200 même en cas d'erreur pour éviter les relivraisons PayPal
        return NextResponse.json({ received: true }, { status: 200 });
    }
}

async function handleCaptureCompleted(resource: any) {
    const orderId =
        resource?.supplementary_data?.related_ids?.order_id || resource?.id;
    const amount = resource?.amount?.value;
    const currency = resource?.amount?.currency_code;
    const customId = resource?.custom_id; // clerkId stocké lors de la création

    if (!orderId || !amount || !customId) {
        console.warn(
            "[PAYPAL_WEBHOOK] Missing required fields in CAPTURE.COMPLETED event",
        );
        return;
    }

    if (currency !== CURRENCY) {
        console.error(
            `[PAYPAL_WEBHOOK] Unexpected currency in webhook: ${currency}`,
        );
        return;
    }

    // Idempotence : ignorer si déjà traité
    const existing = await prisma.transaction.findFirst({
        where: { paypalOrderId: orderId },
    });

    if (existing) {
        console.log(
            `[PAYPAL_WEBHOOK] Order ${orderId} already processed via capture, skipping.`,
        );
        return;
    }

    // Créditer l'utilisateur si le paiement n'a pas été traité (cas de réconciliation)
    await prisma.$transaction(async (tx) => {
        const alreadyExists = await tx.transaction.findFirst({
            where: { paypalOrderId: orderId },
        });
        if (alreadyExists) return;

        const dbUser = await tx.user.findUnique({
            where: { clerkId: customId },
            select: { id: true },
        });

        if (!dbUser) {
            console.error(
                `[PAYPAL_WEBHOOK] User not found for clerkId: ${customId}`,
            );
            return;
        }

        await tx.user.update({
            where: { id: dbUser.id },
            data: { balance: { increment: parseFloat(amount) } },
        });

        await tx.transaction.create({
            data: {
                userId: dbUser.id,
                amount: parseFloat(amount),
                type: "DEPOSIT",
                status: "COMPLETED",
                description: "Dépôt PayPal (webhook reconciliation)",
                reference: orderId,
                method: "PAYPAL",
                currency: CURRENCY,
                paypalOrderId: orderId,
            },
        });

        console.log(
            `[PAYPAL_WEBHOOK] Reconciled payment for user ${customId}: ${amount} EUR`,
        );
    });
}

async function handleCaptureReversed(resource: any) {
    const orderId =
        resource?.supplementary_data?.related_ids?.order_id || resource?.id;
    const amount = resource?.amount?.value;
    const customId = resource?.custom_id;

    if (!orderId || !amount || !customId) {
        console.warn(
            "[PAYPAL_WEBHOOK] Missing required fields in CAPTURE.REVERSED event",
        );
        return;
    }

    console.warn(
        `[PAYPAL_WEBHOOK] CAPTURE REVERSED for order ${orderId}, user ${customId}, amount ${amount} EUR`,
    );

    // Vérifier si la transaction originale existe
    const originalTx = await prisma.transaction.findFirst({
        where: { paypalOrderId: orderId, type: "DEPOSIT" },
    });

    if (!originalTx) {
        console.warn(
            `[PAYPAL_WEBHOOK] No original transaction found for order ${orderId}`,
        );
        return;
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: originalTx.userId },
    });

    if (!dbUser) return;

    await prisma.$transaction(async (tx) => {
        // Créer une transaction de remboursement/débit
        await tx.transaction.create({
            data: {
                userId: dbUser.id,
                amount: parseFloat(amount),
                type: "REFUND",
                status: "COMPLETED",
                description: `Remboursement PayPal (retournement paiement)`,
                reference: orderId,
                method: "PAYPAL",
                currency: CURRENCY,
                paypalOrderId: `${orderId}_reversed`,
            },
        });

        // Déduire du solde si positive
        if (dbUser.balance >= parseFloat(amount)) {
            await tx.user.update({
                where: { id: dbUser.id },
                data: { balance: { decrement: parseFloat(amount) } },
            });
        }
    });

    console.log(
        `[PAYPAL_WEBHOOK] Reversal processed for user ${dbUser.clerkId}`,
    );
}
