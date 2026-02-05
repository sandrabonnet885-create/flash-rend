"use client";

import { useState, useEffect } from "react";
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
import { AlertCircle, Banknote, Loader2, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type BankAccount = {
    id: string;
    iban: string;
    bic: string;
    bankName: string;
    accountHolder: string;
};

export default function WithdrawalPage() {
    const { user } = useUser();
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

    // New Bank Account Form State
    const [isAddingAccount, setIsAddingAccount] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newAccount, setNewAccount] = useState({
        accountHolder: "",
        iban: "",
        bic: "",
        bankName: "",
    });

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    const fetchBankAccounts = async () => {
        setIsLoadingAccounts(true);
        try {
            const res = await fetch("/api/bank-accounts");
            if (res.ok) {
                const data = await res.json();
                setBankAccounts(data);
                if (data.length > 0) {
                    setSelectedAccount(data[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching bank accounts:", error);
            toast.error("Impossible de charger vos comptes bancaires");
        } finally {
            setIsLoadingAccounts(false);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setAmount(value);
    };

    const handleAddAccount = async () => {
        if (!newAccount.iban || !newAccount.accountHolder) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }

        setIsAddingAccount(true);
        try {
            const res = await fetch("/api/bank-accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAccount),
            });

            if (!res.ok) throw new Error("Erreur lors de l'ajout");

            const account = await res.json();
            setBankAccounts([account, ...bankAccounts]);
            setSelectedAccount(account.id);
            setOpenDialog(false);
            setNewAccount({ accountHolder: "", iban: "", bic: "", bankName: "" });
            toast.success("Compte bancaire ajouté avec succès");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout du compte bancaire");
        } finally {
            setIsAddingAccount(false);
        }
    };

    const handleWithdrawal = async () => {
        if (!amount || parseFloat(amount) < 1) {
            toast.error("Le montant minimum de retrait est de 1€");
            return;
        }

        if (!selectedAccount) {
            toast.error("Veuillez sélectionner un compte bancaire");
            return;
        }

        setIsProcessing(true);

        try {
            const res = await fetch("/api/withdrawals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    bankAccountId: selectedAccount,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg);
            }

            toast.success("Votre demande de retrait a été envoyée !");
            setAmount("");
        } catch (error) {
            console.error("Withdrawal error:", error);
            toast.error("Erreur: Solde insuffisant ou problème serveur");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user) return null;

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
                                    inputMode="decimal"
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
                                Montant minimum : 1€
                            </p>
                        </div>

                        {/* Comptes bancaires */}
                        <div>
                            <h3 className="text-sm font-medium mb-3">
                                Compte bancaire de destination
                            </h3>
                            <div className="space-y-3">
                                {isLoadingAccounts ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : bankAccounts.length === 0 ? (
                                    <div className="text-center py-4 border border-dashed rounded-lg text-muted-foreground">
                                        Aucun compte bancaire enregistré
                                    </div>
                                ) : (
                                    bankAccounts.map((account) => (
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
                                                    {account.bankName || "Banque"} ••••{" "}
                                                    {account.iban.slice(-4)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {account.accountHolder}
                                                </p>
                                            </div>
                                            {selectedAccount === account.id && (
                                                <div className="ml-auto text-primary">
                                                    <Check className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}

                                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Ajouter un compte bancaire
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Ajouter un compte bancaire</DialogTitle>
                                            <DialogDescription>
                                                Ajoutez les coordonnées de votre compte pour recevoir vos retraits.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="holder">Titulaire du compte</Label>
                                                <Input 
                                                    id="holder" 
                                                    placeholder="Nom Prénom"
                                                    value={newAccount.accountHolder}
                                                    onChange={(e) => setNewAccount({...newAccount, accountHolder: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="iban">IBAN</Label>
                                                <Input 
                                                    id="iban" 
                                                    placeholder="FR76..."
                                                    value={newAccount.iban}
                                                    onChange={(e) => setNewAccount({...newAccount, iban: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bic">BIC / SWIFT</Label>
                                                <Input 
                                                    id="bic" 
                                                    placeholder="ABCDEF..."
                                                    value={newAccount.bic}
                                                    onChange={(e) => setNewAccount({...newAccount, bic: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bankName">Nom de la banque (Optionnel)</Label>
                                                <Input 
                                                    id="bankName" 
                                                    placeholder="Ex: Boursorama"
                                                    value={newAccount.bankName}
                                                    onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setOpenDialog(false)}>Annuler</Button>
                                            <Button onClick={handleAddAccount} disabled={isAddingAccount}>
                                                {isAddingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Ajouter
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Bouton de confirmation */}
                        <div className="pt-4">
                            <Button
                                onClick={handleWithdrawal}
                                disabled={
                                    !amount ||
                                    !selectedAccount ||
                                    parseFloat(amount) < 1 ||
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
                                        jours ouvrables après validation.
                                    </li>
                                    <li>
                                        Vous devez disposer d'un solde suffisant.
                                    </li>
                                    <li>Montant minimum de retrait : 1€</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
