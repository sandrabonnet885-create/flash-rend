/**
 * Configuration SEO centralisée.
 * Toutes les URL absolues (canonical, OG, sitemap, JSON-LD) dérivent de `siteUrl`.
 */

const rawSiteUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://flashrend.site";

export const siteConfig = {
    name: "FlashRend",
    legalName: "FlashRend SAS",
    url: rawSiteUrl.replace(/\/$/, ""),
    locale: "fr_FR",
    lang: "fr",
    title: "FlashRend - Investissement Crypto Simplifié",
    titleTemplate: "%s | FlashRend",
    description:
        "Investissement en cryptomonnaies simplifié et rapide. Confiez votre capital à nos experts et suivez vos gains en temps réel depuis votre tableau de bord.",
    keywords: [
        "investissement crypto",
        "cryptomonnaie",
        "bitcoin",
        "ethereum",
        "solana",
        "rendement crypto",
        "plateforme d'investissement",
        "trading crypto géré",
        "FlashRend",
    ],
    email: "contact@flashrend.site",
    /** Numéro principal — conservé pour les usages qui n'en attendent qu'un seul. */
    phone: "+33123456789",
    /** Tous les numéros affichés sur le site. `tel` = format E.164 pour les liens. */
    phones: [
        { label: "+33 (0)1 23 45 67 89", tel: "+33123456789" },
        { label: "+33 (0)6 51 94 15 46", tel: "+33651941546" },
    ],
    address: {
        street: "123 Avenue de la Crypto",
        postalCode: "75000",
        city: "Paris",
        country: "FR",
    },
    twitter: "@FlashRend",
    logo: "/logo.png",
} as const;

/** Construit une URL absolue à partir d'un chemin relatif. */
export function absoluteUrl(path = "/"): string {
    return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Sections publiques indexables — source unique pour le sitemap et le menu SEO. */
export const publicRoutes = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const;

/** Chemins privés : jamais indexés (robots.txt + X-Robots-Tag + metadata). */
export const privateRoutes = [
    "/account",
    "/admin",
    "/dashboard",
    "/api",
    "/login",
    "/sso-callback",
] as const;
