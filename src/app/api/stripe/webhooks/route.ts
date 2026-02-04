import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(
            `Webhook signature verification failed: ${error.message}`
        );
        return new NextResponse(`Webhook Error: ${error.message}`, {
            status: 400,
        });
    }

    // Gestion des événements Stripe
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            await handleCheckoutSessionCompleted(session);
            break;

        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log("PaymentIntent was successful!", paymentIntent.id);
            break;

        case "payment_intent.payment_failed":
            const paymentFailed = event.data.object;
            console.warn(
                "Payment failed:",
                paymentFailed.last_payment_error?.message
            );
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), {
        status: 200,
    });
}

async function handleCheckoutSessionCompleted(session: any) {
    try {
        // Récupérer les détails complets de la session
        const stripeSession = await stripe.checkout.sessions.retrieve(
            session.id,
            {
                expand: ["line_items", "payment_intent"],
            }
        );

        // Extraire les métadonnées
        const { userId, amount } = session.metadata || {};

        if (!userId || !amount) {
            console.error("Missing metadata in session:", session.id);
            return;
        }

        // Ici, vous pourriez :
        // 1. Mettre à jour la base de données utilisateur
        // 2. Envoyer un email de confirmation
        // 3. Déclencher d'autres actions métier

        console.log(
            `Payment successful for user ${userId}, amount: ${amount}€`
        );
    } catch (error) {
        console.error("Error handling checkout.session.completed:", error);
    }
}

export const dynamic = "force-dynamic"; // Désactive le cache pour ce point de terminaison
