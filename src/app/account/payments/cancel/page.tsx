"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-8">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* Animated Gradient Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-r from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-l from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">
                <Card className="bg-white/10 dark:bg-slate-950/40 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-slate-800/30">
                    <CardHeader className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <CardTitle className="text-2xl text-red-500">
                            Paiement annulé
                        </CardTitle>
                        <CardDescription>
                            Votre paiement n'a pas été traité
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Message */}
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-sm text-foreground/80">
                                Vous avez annulé le processus de paiement. Aucun
                                montant n'a été débité de votre compte.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <Link href="/account/payments">
                                <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold h-10">
                                    Réessayer le paiement
                                </Button>
                            </Link>
                            <Link href="/account">
                                <Button
                                    variant="outline"
                                    className="w-full border-white/20 hover:bg-white/10 h-10"
                                >
                                    Retour au compte
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
