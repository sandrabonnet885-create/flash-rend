import ContactSection from "@/components/sections/Contact";
import FooterSection from "@/components/sections/Footer";
import HeaderSection from "@/components/sections/Header";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Une question sur votre investissement ? L'équipe FlashRend vous répond 24/7 par formulaire, email ou chat en direct, généralement en moins d'une heure.",
    alternates: { canonical: "/contact" },
    openGraph: {
        title: "Contacter FlashRend",
        description:
            "Une question sur votre investissement ? Notre équipe support vous répond 24/7.",
        url: "/contact",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <main className="pt-16">
            <JsonLd
                data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])}
            />
            <HeaderSection />
            <ContactSection />
            <FooterSection />
        </main>
    );
}
