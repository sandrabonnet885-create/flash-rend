import { faqItems } from "@/lib/faq-data";
import { absoluteUrl, siteConfig } from "@/lib/seo";

/**
 * Injecte un bloc JSON-LD (schema.org) dans le document.
 * Rendu côté serveur : lisible par les crawlers sans exécution de JS.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            // Contenu statique généré par nos soins, pas d'entrée utilisateur.
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
}

const ORGANIZATION_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logo),
        width: 3000,
        height: 3000,
    },
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    currenciesAccepted: "EUR",
    priceRange: "€€",
    address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        postalCode: siteConfig.address.postalCode,
        addressLocality: siteConfig.address.city,
        addressCountry: siteConfig.address.country,
    },
    areaServed: {
        "@type": "Country",
        name: "France",
    },
    contactPoint: [
        {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: siteConfig.email,
            telephone: siteConfig.phone,
            availableLanguage: ["French"],
            areaServed: "FR",
        },
    ],
    sameAs: [`https://twitter.com/${siteConfig.twitter.replace("@", "")}`],
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    publisher: { "@id": ORGANIZATION_ID },
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
        },
    })),
};

/** Fil d'Ariane pour les pages secondaires. */
export function breadcrumbSchema(
    items: { name: string; path: string }[]
): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { name: "Accueil", path: "/" },
            ...items,
        ].map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}
