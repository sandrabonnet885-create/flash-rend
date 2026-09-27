import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (error: any) {
        console.error("[Webhook] Signature validation failed:", error.message);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        console.log(`[Webhook] Received event: ${event.type}`);

        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                await handleCheckoutSessionCompleted(session);
                break;

            case "charge.refunded":
                const charge = event.data.object;
                await handleChargeRefunded(charge);
                break;

            case "payment_intent.payment_failed":
                const paymentIntent = event.data.object;
                await handlePaymentFailed(paymentIntent);
                break;

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[Webhook] Error processing event:", error);
        return new Response("Webhook error", { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(session: any) {
    console.log(
        `[Webhook] Processing checkout session: ${session.id}`,
        `Payment Status: ${session.payment_status}`,
    );

    // Vérifier que le paiement est complété
    if (session.payment_status !== "paid") {
        console.warn(
            `[Webhook] Checkout session ${session.id} not paid yet (status: ${session.payment_status})`,
        );
        return;
    }

    const clerkUserId = session.client_reference_id;

    if (!clerkUserId) {
        console.error(
            `[Webhook] No client_reference_id found in session ${session.id}`,
        );
        return;
    }

    // Vérifier si la transaction existe déjà (éviter les doublons)
    const existingTransaction = await prisma.transaction.findUnique({
        where: { reference: session.id },
    });

    if (existingTransaction) {
        console.log(
            `[Webhook] Transaction already exists for session ${session.id}`,
        );
        return;
    }

    // Trouver l'utilisateur par son ID Clerk
    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
    });

    if (!user) {
        console.error(`[Webhook] User not found with Clerk ID: ${clerkUserId}`);
        return;
    }

    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency?.toUpperCase() || "EUR";

    try {
        const transaction = await prisma.$transaction(async (tx) => {
            // Créer la transaction
            const newTransaction = await tx.transaction.create({
                data: {
                    userId: user.id,
                    amount,
                    currency,
                    type: "DEPOSIT",
                    status: "COMPLETED",
                    description: "Dépôt de fonds via Stripe Checkout",
                    reference: session.id,
                    stripePaymentId: session.payment_intent,
                    method: "STRIPE",
                    metadata: {
                        paymentMethod:
                            session.payment_method_types?.[0] || "unknown",
                        customerEmail: session.customer_email,
                        completedAt: new Date().toISOString(),
                    },
                },
            });

            // Mettre à jour le solde de l'utilisateur
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });

            console.log(
                `[Webhook] ✅ Payment processed successfully for user ${user.id}`,
                `Amount: ${amount}${currency}, New balance: ${updatedUser.balance}${currency}`,
            );

            return newTransaction;
        });

        return transaction;
    } catch (error) {
        console.error(
            `[Webhook] ❌ Error processing payment for user ${user.id}:`,
            error,
        );
        throw error;
    }
}

async function handleChargeRefunded(charge: any) {
    console.log(`[Webhook] Processing refund for charge: ${charge.id}`);

    try {
        // Chercher la transaction associée
        const transaction = await prisma.transaction.findFirst({
            where: { stripePaymentId: charge.payment_intent },
        });

        if (!transaction) {
            console.warn(
                `[Webhook] Transaction not found for charge ${charge.id}`,
            );
            return;
        }

        const refundAmount = charge.amount_refunded / 100;

        await prisma.$transaction(async (tx) => {
            // Créer une transaction de remboursement
            await tx.transaction.create({
                data: {
                    userId: transaction.userId,
                    amount: refundAmount,
                    currency: transaction.currency,
                    type: "REFUND",
                    status: "COMPLETED",
                    description: "Remboursement via Stripe",
                    reference: charge.id,
                    method: "STRIPE",
                    metadata: {
                        originalReference: transaction.reference,
                        refundedAt: new Date().toISOString(),
                        refundAmount: refundAmount,
                    } as any,
                },
            });

            // Remettre les fonds au compte
            await tx.user.update({
                where: { id: transaction.userId },
                data: {
                    balance: {
                        increment: refundAmount,
                    },
                },
            });

            console.log(
                `[Webhook] ✅ Refund processed for transaction ${transaction.id}, Amount: ${refundAmount}`,
            );
        });
    } catch (error) {
        console.error(`[Webhook] ❌ Error processing refund:`, error);
        throw error;
    }
}

async function handlePaymentFailed(paymentIntent: any) {
    console.log(
        `[Webhook] Processing failed payment: ${paymentIntent.id}`,
        `Last error: ${paymentIntent.last_payment_error?.message}`,
    );

    try {
        // Chercher la transaction associée
        const transaction = await prisma.transaction.findFirst({
            where: { stripePaymentId: paymentIntent.id },
        });

        if (transaction) {
            // Marquer la transaction comme échouée
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: "FAILED",
                    method: "STRIPE",
                    metadata: {
                        failedAt: new Date().toISOString(),
                        failureReason:
                            paymentIntent.last_payment_error?.message ||
                            "Unknown error",
                    } as any,
                },
            });

            console.log(
                `[Webhook] ✅ Transaction marked as failed: ${transaction.id}`,
            );
        }
    } catch (error) {
        console.error(`[Webhook] ❌ Error handling payment failure:`, error);
        throw error;
    }
}
