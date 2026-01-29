"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import {
    IconBrandGoogleFilled,
    IconBrandAppleFilled,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function LoginPage() {
    const { isLoaded, signIn } = useSignIn();
    const [isSocialLoading, setIsSocialLoading] = useState<
        "google" | "apple" | null
    >(null);
    const [error, setError] = useState<string | null>(null);

    const handleSocialSignIn = async (
        strategy: "oauth_google" | "oauth_apple",
    ) => {
        if (!isLoaded || !signIn) return;

        setIsSocialLoading(strategy === "oauth_google" ? "google" : "apple");
        setError(null);

        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/account",
            });
        } catch (err: any) {
            const errorMessage =
                err?.errors?.[0]?.message || "Erreur lors de la connexion";
            setError(errorMessage);
            toast.error(errorMessage);
            setIsSocialLoading(null);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* Animated Gradient Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-r from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-l from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">
                {/* Card with Glassmorphism */}
                <div className="bg-white/10 dark:bg-slate-950/40 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-slate-800/30 rounded-2xl p-8 sm:p-10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 mb-6 group"
                        >
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo.png"
                                    alt="FlashRend"
                                    fill
                                    className="object-contain transition-transform group-hover:scale-110"
                                />
                            </div>
                        </Link>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            FlashRend
                        </h1>
                        <p className="text-foreground/60 text-sm">
                            Connectez-vous avec votre compte
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => handleSocialSignIn("oauth_google")}
                            disabled={isSocialLoading !== null}
                            variant="outline"
                            className="w-full border-white/20 hover:bg-white/10 text-foreground h-10"
                        >
                            {isSocialLoading === "google" ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Google...
                                </>
                            ) : (
                                <>
                                    <IconBrandGoogleFilled className="mr-2 h-4 w-4" />
                                    Continuer avec Google
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={() => handleSocialSignIn("oauth_apple")}
                            disabled={isSocialLoading !== null}
                            variant="outline"
                            className="w-full border-white/20 hover:bg-white/10 text-foreground h-10"
                        >
                            {isSocialLoading === "apple" ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Apple...
                                </>
                            ) : (
                                <>
                                    <IconBrandAppleFilled className="mr-2 h-4 w-4" />
                                    Continuer avec Apple
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <Link
                            href="/"
                            className="block text-center text-xs text-foreground/50 hover:text-foreground/70 transition-colors"
                        >
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </div>

                {/* Bottom Info */}
                <p className="text-center text-xs text-foreground/40 mt-6">
                    Votre compte est sécurisé et protégé
                </p>
            </div>
        </div>
    );
}
