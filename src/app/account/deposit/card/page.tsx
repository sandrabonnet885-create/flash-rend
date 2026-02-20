"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    CreditCard,
    Loader2,
    Check,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { StripePaymentButton } from "@/components/stripe/StripePaymentButton";
import { useRouter } from "next/navigation";

const PRESET_AMOUNTS = [10, 50, 100, 500];

export default function CardDepositPage() {
    const { user } = useUser();
    const router = useRouter();
    const [customAmount, setCustomAmount] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const handleCustomAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, ""); // N'autoriser que les chiffres
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    const handlePresetSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount("");
    };

    const handlePaymentSuccess = () => {
        toast.success("Paiement réussi ! Votre compte sera crédité sous peu.");
        router.push("/account/deposit/success"); // Assuming you might have a success page or redirect back to history
    };

    const handlePaymentError = (error: Error) => {
        console.error("Payment error:", error);
        toast.error(
            "Une erreur est survenue lors du traitement de votre paiement.",
        );
    };

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Veuillez vous connecter pour effectuer un dépôt</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="mb-4 pl-0 hover:bg-transparent hover:text-amber-500"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux méthodes de dépôt
                </Button>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <CreditCard className="h-8 w-8 text-purple-500" />
                    Dépôt par Carte Bancaire
                </h1>
                <p className="text-muted-foreground">
                    Ajoutez des fonds instantanément via Stripe
                </p>
            </div>

            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-xl">Montant du dépôt</CardTitle>
                    <CardDescription>
                        Choisissez ou entrez le montant à créditer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Montants prédéfinis */}
                        <div>
                            <h3 className="text-sm font-medium mb-3">
                                Montants suggérés
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {PRESET_AMOUNTS.map((amt) => (
                                    <Button
                                        key={amt}
                                        variant={
                                            selectedAmount === amt
                                                ? "default"
                                                : "outline"
                                        }
                                        className={`h-14 text-lg ${
                                            selectedAmount === amt
                                                ? "bg-primary"
                                                : ""
                                        }`}
                                        onClick={() => handlePresetSelect(amt)}
                                    >
                                        {amt}€
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Montant personnalisé */}
                        <div>
                            <label
                                htmlFor="custom-amount"
                                className="block text-sm font-medium mb-2"
                            >
                                Ou entrez un montant personnalisé
                            </label>
                            <div className="relative">
                                <Input
                                    id="custom-amount"
                                    type="text"
                                    inputMode="numeric"
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    placeholder="Montant en €"
                                    className="pl-8 h-14 text-lg"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    €
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Montant minimum : 10€
                            </p>
                        </div>

                        {/* Bouton de paiement */}
                        <div className="pt-4">
                            {amount && amount >= 10 ? (
                                <StripePaymentButton
                                    amount={amount}
                                    description={`Dépôt de ${amount}€ sur mon compte FlashRend`}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    className="w-full h-14 text-lg"
                                >
                                    Payer {amount}€
                                </StripePaymentButton>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full h-14 text-lg bg-muted text-muted-foreground"
                                >
                                    Entrez un montant valide (min. 10€)
                                </Button>
                            )}
                        </div>

                        {/* Informations de sécurité */}
                        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-purple-500" />
                            <div>
                                <p className="font-medium text-foreground">
                                    Paiement sécurisé
                                </p>
                                <p className="mt-1">
                                    Vos paiements sont cryptés et sécurisés par
                                    Stripe. Nous ne stockons jamais vos
                                    informations de carte bancaire.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
