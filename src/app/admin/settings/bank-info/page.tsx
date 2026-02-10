"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type BankSettings = {
    id?: string;
    accountHolder: string;
    iban: string;
    bic: string;
    bankName: string;
    instructions: string;
    isActive: boolean;
};

export default function BankInfoSettingsPage() {
    const [settings, setSettings] = useState<BankSettings>({
        accountHolder: "",
        iban: "",
        bic: "",
        bankName: "",
        instructions: "",
        isActive: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/bank-transfers/settings");
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setSettings(data);
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch("/api/admin/bank-transfers/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Paramètres enregistrés avec succès");
                setSettings(data.settings);
            } else {
                toast.error(data.error || "Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Erreur serveur");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Informations bancaires</h1>
                <p className="text-foreground/60 mt-1">
                    Configurez les informations de virement bancaire
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Paramètres du compte bancaire</CardTitle>
                    <CardDescription>
                        Ces informations seront affichées aux utilisateurs pour effectuer leurs virements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountHolder">Titulaire du compte *</Label>
                            <Input
                                id="accountHolder"
                                value={settings.accountHolder}
                                onChange={(e) =>
                                    setSettings({ ...settings, accountHolder: e.target.value })
                                }
                                placeholder="CHLOE MELODIE PECHOUX"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="iban">IBAN *</Label>
                            <Input
                                id="iban"
                                value={settings.iban}
                                onChange={(e) =>
                                    setSettings({ ...settings, iban: e.target.value })
                                }
                                placeholder="FR76 1723 8000 0100 3187 9560 175"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bic">BIC *</Label>
                            <Input
                                id="bic"
                                value={settings.bic}
                                onChange={(e) =>
                                    setSettings({ ...settings, bic: e.target.value })
                                }
                                placeholder="SCSYFRP2"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bankName">Nom de la banque *</Label>
                            <Input
                                id="bankName"
                                value={settings.bankName}
                                onChange={(e) =>
                                    setSettings({ ...settings, bankName: e.target.value })
                                }
                                placeholder="PCS"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructions">Instructions personnalisées</Label>
                            <Textarea
                                id="instructions"
                                value={settings.instructions}
                                onChange={(e) =>
                                    setSettings({ ...settings, instructions: e.target.value })
                                }
                                placeholder="Veuillez effectuer votre virement en utilisant les informations ci-dessus..."
                                rows={4}
                            />
                            <p className="text-xs text-foreground/60">
                                Message affiché aux utilisateurs avec les informations bancaires
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={settings.isActive}
                                onChange={(e) =>
                                    setSettings({ ...settings, isActive: e.target.checked })
                                }
                                className="rounded"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Activer les dépôts par virement bancaire
                            </Label>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Enregistrer
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
