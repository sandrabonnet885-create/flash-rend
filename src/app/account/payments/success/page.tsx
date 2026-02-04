"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [isLoading, setIsLoading] = useState(true);
    const [sessionData, setSessionData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifySession = async () => {
            if (!sessionId) {
                setError("ID de session manquant");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/stripe/verify-session?session_id=${sessionId}`
                );

                if (!response.ok) {
                    throw new Error("Erreur lors de la vérification");
                }

                const data = await response.json();
                setSessionData(data);
            } catch (err) {
                console.error("Verification error:", err);
                setError("Erreur lors de la vérification du paiement");
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [sessionId]);

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
                        {isLoading ? (
                            <>
                                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-500" />
                                <CardTitle>
                                    Vérification du paiement...
                                </CardTitle>
                            </>
                        ) : error ? (
                            <>
                                <CardTitle className="text-red-500">
                                    Erreur
                                </CardTitle>
                                <CardDescription>{error}</CardDescription>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <CardTitle className="text-2xl text-green-500">
                                    Paiement réussi!
                                </CardTitle>
                                <CardDescription>
                                    Merci pour votre paiement
                                </CardDescription>
                            </>
                        )}
                    </CardHeader>

                    {!isLoading && sessionData && !error && (
                        <CardContent className="space-y-6">
                            {/* Payment Details */}
                            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground/60">
                                        Email:
                                    </span>
                                    <span className="text-foreground font-semibold">
                                        {sessionData.customer_email}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground/60">
                                        Montant:
                                    </span>
                                    <span className="text-foreground font-semibold">
                                        {(
                                            sessionData.amount_total / 100
                                        ).toFixed(2)}
                                        €
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground/60">
                                        Statut:
                                    </span>
                                    <span className="text-green-400 font-semibold">
                                        {sessionData.payment_status === "paid"
                                            ? "Payé"
                                            : "En attente"}
                                    </span>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <p className="text-sm text-foreground/80">
                                    Votre crédit a été ajouté à votre compte.
                                    Vous pouvez maintenant utiliser vos fonds
                                    pour faire des investissements sur
                                    FlashRend.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                <Link href="/account">
                                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold h-10">
                                        Retour au compte
                                    </Button>
                                </Link>
                                <Link href="/account/payments">
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/20 hover:bg-white/10 h-10"
                                    >
                                        Faire un autre paiement
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    )}

                    {error && (
                        <CardContent className="space-y-4">
                            <Link href="/account">
                                <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold h-10">
                                    Retour au compte
                                </Button>
                            </Link>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 animate-spin text-amber-500 mb-4" />
                        <p className="text-lg">Chargement...</p>
                    </div>
                </div>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}
