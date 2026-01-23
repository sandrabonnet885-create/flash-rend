"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "Qui sommes-nous", href: "#qui-sommes-nous" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Simulation", href: "#simulation" },
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
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hidden sm:inline">
                        FlashRend
                    </span>
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
                    <a
                        href="/#contact"
                        className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Contact
                    </a>
                </div>

                {/* CTA and Mobile Menu */}
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="default" size="sm">
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
                        <SheetContent
                            side="right"
                            className="w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md"
                        >
                            <div className="flex flex-col gap-6 mt-8">
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
                                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                        FlashRend
                                    </span>
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
