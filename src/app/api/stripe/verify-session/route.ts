import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json(
            { error: "Session ID manquant" },
            { status: 400 },
        );
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            id: session.id,
            payment_status: session.payment_status,
            customer_email: session.customer_email,
            amount_total: session.amount_total,
            metadata: session.metadata,
        });
    } catch (error) {
        console.error("Stripe error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de la session" },
            { status: 500 },
        );
    }
}
