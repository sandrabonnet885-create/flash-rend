import "server-only";
import Stripe from "stripe";

// Vérification des variables d'environnement requises
const requiredEnvVars = [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_APP_URL",
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`La variable d'environnement ${envVar} est requise`);
    }
}

// Configuration de Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
    appInfo: {
        name: "FlashRend",
        version: "1.0.0",
        url: process.env.NEXT_PUBLIC_APP_URL,
    },
});

// Types utilitaires
export type StripeProduct = {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    metadata: Record<string, string>;
};

export type StripePrice = {
    id: string;
    product: string;
    active: boolean;
    currency: string;
    unit_amount: number | null;
    type: "one_time" | "recurring";
    recurring?: {
        interval: "day" | "week" | "month" | "year";
        interval_count: number;
    };
};

// Fonction utilitaire pour formater les montants
export function formatAmountForDisplay(
    amount: number,
    currency: string
): string {
    const numberFormat = new Intl.NumberFormat(["fr-FR"], {
        style: "currency",
        currency,
        currencyDisplay: "symbol",
    });
    return numberFormat.format(amount / 100);
}

// Fonction pour obtenir l'URL de base avec fallback
export function getBaseUrl(requestUrl?: string): string {
    // 1. Utiliser l'URL de la requête si disponible (pour détecter le domaine actuel)
    if (requestUrl) {
        try {
            const url = new URL(requestUrl);
            return `${url.protocol}//${url.host}`;
        } catch (e) {
            // Ignorer les erreurs de parsing
        }
    }

    // 2. Utiliser NEXT_PUBLIC_APP_URL (domaine principal)
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    // 3. Fallback sur le sous-domaine Vercel
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    // 4. Fallback final pour le développement local
    return "http://localhost:3000";
}

// Fonction pour créer un checkout session
export async function createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams,
    requestUrl?: string
) {
    const baseUrl = getBaseUrl(requestUrl);

    return stripe.checkout.sessions.create({
        ...params,
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${baseUrl}/account/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/account/payments/cancel`,
    });
}
