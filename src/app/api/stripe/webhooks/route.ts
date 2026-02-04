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
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                await handleCheckoutSessionCompleted(session);
                break;
            // Gérer d'autres événements...
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response("Webhook error", { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(session: any) {
    const userId = session.client_reference_id;
    if (!userId) {
        console.error("Aucun client_reference_id trouvé dans la session");
        return;
    }

    const amount = session.amount_total ? session.amount_total / 100 : 0;

    // Trouver l'utilisateur par son ID Clerk
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        console.error(`Utilisateur non trouvé avec l'ID: ${userId}`);
        return;
    }

    await prisma.$transaction(async (tx) => {
        // Créer la transaction
        const transaction = await tx.transaction.create({
            data: {
                userId: user.id,
                amount,
                type: "DEPOSIT",
                status: "COMPLETED",
                description: "Dépôt de fonds via Stripe",
                reference: session.id,
                stripePaymentId: session.payment_intent,
                metadata: {
                    paymentMethod:
                        session.payment_method_types?.[0] || "inconnu",
                    currency: session.currency || "eur",
                    createdAt: new Date().toISOString(),
                },
            },
        });

        // Mettre à jour le solde de l'utilisateur
        await tx.user.update({
            where: { id: user.id },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });

        return transaction;
    });
}
