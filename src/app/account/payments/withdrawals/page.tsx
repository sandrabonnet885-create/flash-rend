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
import { AlertCircle, Banknote, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type BankAccount = {
    id: string;
    last4: string;
    bankName: string;
};

export default function WithdrawalPage() {
    const { user } = useUser();
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    // Données factices pour les comptes bancaires
    const bankAccounts: BankAccount[] = [
        { id: "1", last4: "4242", bankName: "Banque de France" },
        { id: "2", last4: "1234", bankName: "Crédit Agricole" },
    ];

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // N'autoriser que les chiffres
        setAmount(value);
    };

    const handleWithdrawal = async () => {
        if (!amount || parseFloat(amount) < 10) {
            toast.error("Le montant minimum de retrait est de 10€");
            return;
        }

        if (!selectedAccount) {
            toast.error("Veuillez sélectionner un compte bancaire");
            return;
        }

        setIsProcessing(true);

        try {
            // Simuler un appel API
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Ici, vous feriez un appel à votre API pour effectuer le retrait
            // await fetch('/api/withdrawals', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         amount: parseFloat(amount),
            //         accountId: selectedAccount,
            //         userId: user?.id
            // })
            // });

            toast.success("Votre demande de retrait a été prise en compte");
            setAmount("");
            setSelectedAccount(null);
        } catch (error) {
            console.error("Withdrawal error:", error);
            toast.error(
                "Une erreur est survenue lors de votre demande de retrait"
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Veuillez vous connecter pour effectuer un retrait</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Demander un retrait</h1>
                <p className="text-muted-foreground">
                    Retirez vos fonds vers votre compte bancaire
                </p>
            </div>

            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Détails du retrait</CardTitle>
                    <CardDescription>
                        Les retraits sont généralement traités sous 1 à 3 jours
                        ouvrables
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Montant du retrait */}
                        <div>
                            <label
                                htmlFor="withdrawal-amount"
                                className="block text-sm font-medium mb-2"
                            >
                                Montant à retirer (€)
                            </label>
                            <div className="relative">
                                <Input
                                    id="withdrawal-amount"
                                    type="text"
                                    inputMode="numeric"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Montant en €"
                                    className="pl-8 h-14 text-lg"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    €
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Solde disponible : 0.00€ • Montant minimum : 10€
                            </p>
                        </div>

                        {/* Comptes bancaires */}
                        <div>
                            <h3 className="text-sm font-medium mb-3">
                                Compte bancaire de destination
                            </h3>
                            <div className="space-y-3">
                                {bankAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                            selectedAccount === account.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                        onClick={() =>
                                            setSelectedAccount(account.id)
                                        }
                                    >
                                        <div className="bg-muted p-2 rounded-full mr-3">
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {account.bankName} ••••{" "}
                                                {account.last4}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Compte courant
                                            </p>
                                        </div>
                                        {selectedAccount === account.id && (
                                            <div className="ml-auto text-primary">
                                                <Check className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full mt-2"
                                >
                                    + Ajouter un compte bancaire
                                </Button>
                            </div>
                        </div>

                        {/* Bouton de confirmation */}
                        <div className="pt-4">
                            <Button
                                onClick={handleWithdrawal}
                                disabled={
                                    !amount ||
                                    !selectedAccount ||
                                    parseFloat(amount) < 10 ||
                                    isProcessing
                                }
                                className="w-full h-14 text-lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Traitement...
                                    </>
                                ) : (
                                    "Confirmer le retrait"
                                )}
                            </Button>
                        </div>

                        {/* Informations */}
                        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-medium">
                                    Informations importantes
                                </p>
                                <ul className="mt-2 space-y-1 list-disc pl-5">
                                    <li>
                                        Les retraits sont traités sous 1 à 3
                                        jours ouvrables
                                    </li>
                                    <li>
                                        Frais de retrait : 0.50€ par opération
                                    </li>
                                    <li>Montant minimum de retrait : 10€</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
