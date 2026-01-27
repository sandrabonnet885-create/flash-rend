"use client";

import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* Animated Gradient Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-r from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-l from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            {/* Main Container */}
            <div className="relative z-10 w-fit mx-auto px-4 sm:px-6">
                {/* Card with Glassmorphism */}
                <div className="bg-white/10 dark:bg-slate-950/40 backdrop-blur-xl backdrop-saturate-150 border border-slate-800/30 rounded-2xl p-8 sm:p-10 shadow-2xl">
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
                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                FlashRend
                            </h1>
                        </Link>

                        <p className="text-foreground/60 text-sm">
                            Connectez-vous à votre compte
                        </p>
                    </div>

                    {/* Clerk SignIn Component */}
                    <div className="mb-6">
                        <SignIn
                            routing="path"
                            path="/login"
                            afterSignInUrl="/account"
                            forceRedirectUrl="/account"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-transparent border-0 shadow-none",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    dividerLine: "bg-white/10",
                                    dividerText: "text-foreground/50 text-xs",
                                    formFieldLabel:
                                        "text-foreground text-sm font-medium",
                                    formFieldInput:
                                        "bg-white/10 border border-white/20 text-foreground placeholder:text-foreground/40 focus:bg-white/15 focus:border-amber-500/50 rounded-lg",
                                    formButtonPrimary:
                                        "bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg",
                                    footerActionLink:
                                        "text-amber-500 hover:text-amber-400",
                                    socialButtonsBlockButton:
                                        "border border-white/20 bg-white/5 hover:bg-white/10 text-foreground mb-4",
                                    socialButtonsBlockButtonText:
                                        "text-sm font-medium",
                                },
                            }}
                        />
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
            </div>
        </div>
    );
}
