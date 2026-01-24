import ContactSection from "@/components/sections/Contact";
import FooterSection from "@/components/sections/Footer";
import HeaderSection from "@/components/sections/Header";

export default function ContactPage() {
    return (
        <main className="pt-16">
            <HeaderSection />
            <ContactSection />
            <FooterSection />
        </main>
    );
}
