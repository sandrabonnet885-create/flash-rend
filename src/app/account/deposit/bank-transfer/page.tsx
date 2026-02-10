"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type BankSettings = {
    accountHolder: string;
    iban: string;
    bic: string;
    bankName: string;
    instructions: string;
};

export default function BankTransferDepositPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<BankSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        amount: "",
        reference: "",
        transferDate: new Date().toISOString().split("T")[0],
        proofUrl: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/deposit/bank-transfer/settings");
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Erreur lors du chargement des informations");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success("Copié dans le presse-papier");
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/deposit/bank-transfer/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Demande de dépôt soumise avec succès");
                router.push("/account/deposit/bank-transfer/history");
            } else {
                toast.error(data.error || "Erreur lors de la soumission");
            }
        } catch (error) {
            console.error("Error submitting deposit:", error);
            toast.error("Erreur serveur");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-foreground/60">Erreur de chargement</p>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/account">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Dépôt par virement bancaire</h1>
                    <p className="text-foreground/60 mt-1">
                        Effectuez un dépôt via virement bancaire
                    </p>
                </div>
            </div>

            {/* Instructions */}
            <Card className="border-amber-500/20 bg-amber-500/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Instructions importantes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/80">
                        {settings.instructions}
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <div>
                                <p className="text-xs text-foreground/60">Bénéficiaire</p>
                                <p className="font-semibold">{settings.accountHolder}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(settings.accountHolder, "holder")}
                            >
                                {copiedField === "holder" ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <div>
                                <p className="text-xs text-foreground/60">IBAN</p>
                                <p className="font-mono font-semibold">{settings.iban}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(settings.iban, "iban")}
                            >
                                {copiedField === "iban" ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <div>
                                <p className="text-xs text-foreground/60">BIC</p>
                                <p className="font-mono font-semibold">{settings.bic}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(settings.bic, "bic")}
                            >
                                {copiedField === "bic" ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <div>
                                <p className="text-xs text-foreground/60">Banque</p>
                                <p className="font-semibold">{settings.bankName}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Formulaire de soumission */}
            <Card>
                <CardHeader>
                    <CardTitle>Déclarer votre virement</CardTitle>
                    <CardDescription>
                        Après avoir effectué le virement, remplissez ce formulaire
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Montant (€) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="1"
                                placeholder="100.00"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reference">Référence de transaction *</Label>
                            <Input
                                id="reference"
                                type="text"
                                placeholder="Ex: TRX123456"
                                value={formData.reference}
                                onChange={(e) =>
                                    setFormData({ ...formData, reference: e.target.value })
                                }
                                required
                            />
                            <p className="text-xs text-foreground/60">
                                Indiquez la référence visible sur votre relevé bancaire
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transferDate">Date du virement *</Label>
                            <Input
                                id="transferDate"
                                type="date"
                                value={formData.transferDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, transferDate: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proofUrl">Preuve de virement (optionnel)</Label>
                            <Input
                                id="proofUrl"
                                type="url"
                                placeholder="https://..."
                                value={formData.proofUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, proofUrl: e.target.value })
                                }
                            />
                            <p className="text-xs text-foreground/60">
                                URL d'une capture d'écran de votre virement (optionnel)
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Envoi...
                                    </>
                                ) : (
                                    "Soumettre"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Lien vers l'historique */}
            <div className="text-center">
                <Link href="/account/deposit/bank-transfer/history">
                    <Button variant="link">
                        Voir l'historique de mes dépôts
                    </Button>
                </Link>
            </div>
        </div>
    );
}
