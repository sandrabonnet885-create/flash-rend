"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "Qui sommes-nous", href: "#qui-sommes-nous" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Simulation", href: "#simulation" },
    { label: "FAQ", href: "#faq" },
];

export default function HeaderSection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-white/10 dark:bg-slate-950/10 backdrop-blur-md backdrop-saturate-150 border-b border-white/20 dark:border-slate-800/20" />

            {/* Content */}
            <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo and Brand */}
                <Link href="#accueil" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/logo.png"
                            alt="FlashRend Logo"
                            fill
                            className="object-contain transition-transform group-hover:scale-110"
                            priority
                        />
                    </div>
                    <h1 className="text-xl font-bold font-mono hidden sm:inline">
                        <span className="text-primary">Flash</span>Rend
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>
                </div>

                {/* CTA and Mobile Menu */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hover:cursor-pointer">
                        <Button
                            variant="default"
                            size="sm"
                            className="hover:cursor-pointer"
                        >
                            Se connecter
                        </Button>
                    </Link>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 bg-black">
                            <div className="flex flex-col gap-6 mt-8 px-4">
                                {/* Mobile Logo */}
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            src="/logo.png"
                                            alt="FlashRend Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h1 className="font-bold font-mono">
                                        <span className="text-primary">
                                            Flash
                                        </span>
                                        Rend
                                    </h1>
                                </div>

                                {/* Mobile Navigation Links */}
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-foreground/70 hover:text-foreground transition-colors font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <a
                                        href="/#contact"
                                        className="text-foreground/70 hover:text-foreground transition-colors font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Contact
                                    </a>
                                </nav>

                                {/* Mobile CTA */}
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full"
                                >
                                    <Button className="w-full">
                                        Se connecter
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
