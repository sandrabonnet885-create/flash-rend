"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "flashrend_cookie_consent";

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => {
                setShowBanner(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
            <Card className="max-w-5xl mx-auto bg-slate-950/95 backdrop-blur-xl border-amber-500/20 shadow-2xl shadow-amber-500/10">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        {/* Icon */}
                        <div className="shrink-0 p-3 bg-amber-500/10 rounded-full">
                            <Cookie className="h-6 w-6 text-amber-500" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2 text-white">
                                🍪 Nous utilisons des cookies
                            </h3>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies.{" "}
                                <Link
                                    href="/privacy"
                                    className="text-amber-500 hover:text-amber-600 underline"
                                >
                                    En savoir plus
                                </Link>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                            <Button
                                onClick={handleDecline}
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 w-full sm:w-auto"
                            >
                                Refuser
                            </Button>
                            <Button
                                onClick={handleAccept}
                                className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-semibold w-full sm:w-auto"
                            >
                                Accepter
                            </Button>
                        </div>

                        {/* Close button (mobile) */}
                        <button
                            onClick={handleDecline}
                            className="absolute top-4 right-4 sm:hidden text-foreground/50 hover:text-foreground"
                            aria-label="Fermer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
