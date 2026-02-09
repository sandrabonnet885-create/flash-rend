import AboutSection from "@/components/sections/About";
import FAQSection from "@/components/sections/FAQ";
import FooterSection from "@/components/sections/Footer";
import HeaderSection from "@/components/sections/Header";
import HeroSection from "@/components/sections/Hero";
import SimulationSection from "@/components/sections/Simulation";
import TestimonialsSection from "@/components/sections/Testimonials";
import WhoItWorkSection from "@/components/sections/WhoItWork";

export default function Home() {
    return (
        <main className="pt-16">
            <HeaderSection />
            <HeroSection />
            <AboutSection />
            <WhoItWorkSection />
            <SimulationSection />
            <TestimonialsSection />
            <FAQSection />
            <FooterSection />
        </main>
    );
}
