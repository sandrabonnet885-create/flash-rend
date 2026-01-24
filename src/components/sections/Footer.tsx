"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
    navigation: [
        { label: "Accueil", href: "#accueil" },
        { label: "Qui sommes-nous", href: "#qui-sommes-nous" },
        { label: "Comment ça marche", href: "#comment-ca-marche" },
        { label: "Simulation", href: "#simulation" },
        { label: "FAQ", href: "#faq" },
    ],
    legal: [
        { label: "Conditions d'utilisation", href: "/terms" },
        { label: "Politique de confidentialité", href: "/privacy" },
        { label: "Mentions légales", href: "/legal" },
    ],
    social: [
        { label: "Facebook", href: "https://facebook.com" },
        { label: "Twitter", href: "https://twitter.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "Instagram", href: "https://instagram.com" },
    ],
};

export default function FooterSection() {
    return (
        <footer className="bg-slate-950/50 border-t border-white/10 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link
                            href="#accueil"
                            className="flex items-center gap-2 mb-6"
                        >
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo.png"
                                    alt="FlashRend Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                FlashRend
                            </span>
                        </Link>
                        <p className="text-foreground/60 text-sm mb-6">
                            Investissement en cryptomonnaies simplifié et
                            rapide. Générez des rendements exceptionnels avec
                            nos experts.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Navigation</h4>
                        <ul className="space-y-3">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Nous suivre</h4>
                        <ul className="space-y-3">
                            {footerLinks.social.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4">Nous contacter</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 mt-1 text-amber-500 shrink-0" />
                                <Link
                                    href="mailto:contact@flashrend.com"
                                    className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                                >
                                    contact@flashrend.com
                                </Link>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 mt-1 text-amber-500 shrink-0" />
                                <Link
                                    href="tel:+33123456789"
                                    className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                                >
                                    +33 (0)1 23 45 67 89
                                </Link>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 text-amber-500 shrink-0" />
                                <span className="text-foreground/60 text-sm">
                                    123 Avenue de la Crypto
                                    <br />
                                    75000 Paris, France
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <Separator className="bg-white/10 mb-6" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-foreground/60 text-sm">
                        © {new Date().getFullYear()} FlashRend. Tous droits
                        réservés.
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-foreground/60 hover:text-foreground transition-colors text-xs"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
