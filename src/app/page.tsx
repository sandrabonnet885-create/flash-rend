import AboutSection from "@/components/sections/About";
import FAQSection from "@/components/sections/FAQ";
import FooterSection from "@/components/sections/Footer";
import HeaderSection from "@/components/sections/Header";
import HeroSection from "@/components/sections/Hero";
import RiskDisclaimerSection from "@/components/sections/RiskDisclaimer";
import SimulationSection from "@/components/sections/Simulation";
import TestimonialsSection from "@/components/sections/Testimonials";
import WhoItWorkSection from "@/components/sections/WhoItWork";
import { JsonLd, faqSchema } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
    // `absolute` court-circuite le template "%s | FlashRend".
    // Mot-clé en tête, marque à la fin : 53 caractères, pas de troncature dans
    // les résultats de recherche.
    title: {
        absolute: "Investissement crypto simplifié et rapide | FlashRend",
    },
    description: siteConfig.description,
    alternates: { canonical: "/" },
};

export default function Home() {
    return (
        <main className="pt-16">
            <JsonLd data={faqSchema} />
            <HeaderSection />
            <HeroSection />
            <AboutSection />
            <WhoItWorkSection />
            <SimulationSection />
            <TestimonialsSection />
            <FAQSection />
            <RiskDisclaimerSection />
            <FooterSection />
        </main>
    );
}
