"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

export default function PaymentPage() {
    const { user } = useUser();
    const router = useRouter();
    const [customAmount, setCustomAmount] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-foreground/60">Veuillez vous connecter...</p>
            </div>
        );
    }

    const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

    const handlePayment = async (amount: number | null) => {
        if (!amount || amount < 1) {
            toast.error("Veuillez entrer un montant valide (minimum 1€)");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    userEmail: user.emailAddresses[0]?.emailAddress,
                    userId: user.id,
                }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création de la session");
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            toast.error("Erreur lors du paiement");
            console.error("Payment error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-8">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* Animated Gradient Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-r from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-l from-amber-500/20 to-orange-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
                {/* Payment Card */}
                <Card className="bg-white/10 dark:bg-slate-950/40 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-slate-800/30">
                    <CardHeader>
                        <CardTitle className="text-3xl bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Effectuer un paiement
                        </CardTitle>
                        <CardDescription className="text-foreground/60">
                            Choisissez un montant ou entrez un montant
                            personnalisé
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Info User */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-sm text-foreground/60 mb-1">
                                Paiement pour:
                            </p>
                            <p className="text-foreground font-semibold">
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>

                        {/* Preset Amounts */}
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-4">
                                Montants prédéfinis
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {PRESET_AMOUNTS.map((amount) => (
                                    <Button
                                        key={amount}
                                        onClick={() => {
                                            setSelectedAmount(amount);
                                            setCustomAmount("");
                                        }}
                                        className={`h-12 font-semibold transition-all ${
                                            selectedAmount === amount &&
                                            !customAmount
                                                ? "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0"
                                                : "bg-white/10 border border-white/20 hover:bg-white/20 text-foreground"
                                        }`}
                                    >
                                        {amount}€
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Amount */}
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Montant personnalisé
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Entrez un montant..."
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setSelectedAmount(null);
                                        }}
                                        className="bg-white/10 border border-white/20 text-foreground placeholder:text-foreground/40 focus:bg-white/15 focus:border-amber-500/50 h-10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60">
                                        €
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        {finalAmount && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
                                <Check className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Montant à payer: {finalAmount}€
                                    </p>
                                    <p className="text-xs text-foreground/60 mt-1">
                                        Vous serez redirigé vers le paiement
                                        sécurisé Stripe
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error if no amount */}
                        {!finalAmount && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-400">
                                    Sélectionnez ou entrez un montant pour
                                    continuer
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handlePayment(finalAmount)}
                                disabled={!finalAmount || isLoading}
                                className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold h-11"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Traitement...
                                    </>
                                ) : (
                                    "Procéder au paiement"
                                )}
                            </Button>

                            <Button
                                onClick={() => router.back()}
                                disabled={isLoading}
                                variant="outline"
                                className="border-white/20 hover:bg-white/10 h-11"
                            >
                                Annuler
                            </Button>
                        </div>

                        {/* Info Security */}
                        <p className="text-xs text-foreground/40 text-center">
                            Paiement sécurisé avec Stripe • PCI Compliant • SSL
                            Encrypté
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
