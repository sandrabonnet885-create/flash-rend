"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 p-4">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05),transparent_70%)]" />

            <div className="relative z-10 w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="mb-6 inline-flex p-4 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2 text-white">
                        Erreur Système
                    </h1>
                    <p className="text-slate-400">
                        Un incident technique a été détecté.
                    </p>
                </div>

                <Alert variant="destructive" className="mb-10 bg-slate-900 shadow-2xl border-red-500/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-lg mb-2">Détails de l'interruption</AlertTitle>
                    <AlertDescription className="text-base">
                        {error.message || "Une erreur critique s'est produite lors de l'exécution de la plateforme."}
                        {error.digest && (
                            <span className="block mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                Référence : {error.digest}
                            </span>
                        )}
                    </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-14 text-lg shadow-xl shadow-red-500/20"
                    >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        Réessayer
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5 h-14 text-lg"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Accueil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
