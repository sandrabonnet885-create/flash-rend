"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const processingMessages = [
    "🔍 Vérification de votre montant...",
    "📊 Analyse de l'indice du marché crypto...",
    "⚡ Évaluation des opportunités Bitcoin...",
    "🔗 Scan des tendances Ethereum...",
    "🚀 Détection des monnaies à haut potentiel...",
    "💡 Application de nos algorithmes d'experts...",
    "✅ Calcul de vos gains potentiels...",
];

export default function InvestmentPage() {
    const { user } = useUser();
    const router = useRouter();
    const [montant, setMontant] = useState<string>("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedGain, setDisplayedGain] = useState(0);
    const [isCountingUp, setIsCountingUp] = useState(false);

    // Handle messages progression
    useEffect(() => {
        if (!isSimulating) return;

        if (currentMessageIndex < processingMessages.length) {
            const timer = setTimeout(() => {
                setCurrentMessageIndex((prev) => prev + 1);
            }, 800);

            return () => clearTimeout(timer);
        } else {
            // Messages finished, perform API call to create investment
            createInvestment();
        }
    }, [isSimulating, currentMessageIndex]);

    const createInvestment = async () => {
        try {
            const res = await fetch("/api/investments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(montant) }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg);
            }

            const data = await res.json();
            // Start animation with the real returned potential return logic
            // (Even though API returns exact value, we animate it)
            setResult(data.potentialReturn);
            setIsCountingUp(true);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'investissement (Fonds insuffisants ?)");
            setIsSimulating(false);
            setCurrentMessageIndex(0);
        }
    };

    // Handle counter animation
    useEffect(() => {
        if (!isCountingUp || !result) return;

        let current = 0;
        const increment = result / 60; // Animate over 60 frames
        let frames = 0;

        const counter = setInterval(() => {
            frames++;
            current += increment;

            if (frames >= 60) {
                setDisplayedGain(result);
                clearInterval(counter);
                setIsCountingUp(false);
                setIsSimulating(false);
                toast.success("Investissement validé avec succès !");
            } else {
                setDisplayedGain(current);
            }
        }, 16);

        return () => clearInterval(counter);
    }, [isCountingUp, result]);

    const handleInvest = () => {
        if (!montant || parseFloat(montant) <= 0) {
            toast.error("Veuillez entrer un montant valide");
            return;
        }

        setIsSimulating(true);
        setCurrentMessageIndex(0);
        setDisplayedGain(0);
        setResult(null);
    };

    const montantNum = parseFloat(montant) || 0;
    const gain = result || 0;
    const percentage =
        montantNum > 0
            ? (((gain - montantNum) / montantNum) * 100).toFixed(0)
            : 0;

    return (
        <div className="container mx-auto px-4 py-8">
             <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Nouvel Investissement</h1>
                <p className="text-muted-foreground">
                    Faites travailler votre argent avec nos algorithmes haute performance
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Input Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Combien souhaitez-vous investir ?</CardTitle>
                        <CardDescription>Solde disponible: chargement...</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Montant
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                                    €
                                </span>
                                <Input
                                    type="number"
                                    placeholder="1000"
                                    value={montant}
                                    onChange={(e) => setMontant(e.target.value)}
                                    disabled={isSimulating}
                                    min="10"
                                    className="pl-8 text-lg h-14"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Minimum conseillé: 50€</p>
                        </div>

                        <Button
                            onClick={handleInvest}
                            disabled={isSimulating || !montant}
                            size="lg"
                            className="w-full text-lg h-14"
                        >
                            {isSimulating ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                "Lancer l'investissement"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Result Card */}
                <Card className={result ? "border-green-500/50 bg-green-500/5" : ""}>
                    <CardHeader>
                        <CardTitle>Résultat de l'analyse</CardTitle>
                        <CardDescription>
                            Intelligence Artificielle en action
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isSimulating ? (
                            <div className="space-y-4">
                                {processingMessages
                                    .slice(0, currentMessageIndex + 1)
                                    .map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 text-sm animate-fadeIn"
                                        >
                                            {idx === currentMessageIndex ? (
                                                <Loader2 className="h-4 w-4 animate-spin mt-0.5 text-primary shrink-0" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            )}
                                            <span className="text-foreground/80">
                                                {msg}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        ) : result !== null ? (
                            <div className="space-y-4 text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Investissement initial
                                    </p>
                                    <p className="text-2xl font-bold">
                                        €{montantNum.toFixed(2)}
                                    </p>
                                </div>

                                <div className="h-px bg-border/50 w-1/2 mx-auto" />

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Gain Potentiel Estimé
                                    </p>
                                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-400">
                                        €{displayedGain.toFixed(2)}
                                    </p>
                                </div>

                                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Rendement immédiat
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                        +{percentage}%
                                    </p>
                                </div>
                                
                                <Button className="w-full" variant="outline" onClick={() => router.push('/account/investments/history')}>
                                    Voir mon historique
                                </Button>
                                
                                <p className="text-xs text-muted-foreground mt-4">
                                    * La durée de l'investissement est aléatoire (entre 20 et 30 minutes).
                                    Vos gains seront disponibles automatiquement après cette période.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground h-full">
                                <Badge variant="outline" className="mb-4">Prêt</Badge>
                                <p>
                                    Entrez un montant et lancez l'IA pour démarrer un investissement.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
