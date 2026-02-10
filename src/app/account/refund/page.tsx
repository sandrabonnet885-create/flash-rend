"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const REFUND_REASONS = [
    { value: "technical_issue", label: "Problème technique" },
    { value: "unauthorized_transaction", label: "Transaction non autorisée" },
    { value: "service_not_received", label: "Service non reçu" },
    { value: "investment_issue", label: "Problème d'investissement" },
    { value: "other", label: "Autre raison" },
];

export default function RefundPage() {
    const { user } = useUser();
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-foreground/60">Veuillez vous connecter...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Veuillez entrer un montant valide");
            return;
        }

        if (!reason) {
            toast.error("Veuillez sélectionner une raison");
            return;
        }

        if (!description || description.trim().length < 10) {
            toast.error("Veuillez fournir une description détaillée (minimum 10 caractères)");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/refund/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    reason,
                    description: description.trim(),
                    userEmail: user.emailAddresses[0]?.emailAddress,
                    userId: user.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la demande");
            }

            toast.success("Demande de remboursement envoyée avec succès");
            
            // Reset form
            setAmount("");
            setReason("");
            setDescription("");

            // Redirect to refund history after 2 seconds
            setTimeout(() => {
                router.push("/account/refund/history");
            }, 2000);
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue");
            console.error("Refund request error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Info Alert */}
            <Alert className="border-amber-500/30 bg-amber-500/10">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-500">Information importante</AlertTitle>
                <AlertDescription className="text-foreground/70">
                    Les demandes de remboursement sont traitées sous 5-7 jours ouvrables. 
                    Vous recevrez une notification par email une fois votre demande traitée.
                </AlertDescription>
            </Alert>

            {/* Main Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Demande de remboursement</CardTitle>
                    <CardDescription>
                        Remplissez le formulaire ci-dessous pour soumettre une demande de remboursement
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Info */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-foreground/60 mb-1">
                                Demande pour:
                            </p>
                            <p className="text-foreground font-semibold">
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Montant à rembourser <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isLoading}
                                    className="pr-8"
                                    required
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60">
                                    €
                                </span>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Raison du remboursement <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={reason}
                                onValueChange={setReason}
                                disabled={isLoading}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une raison" />
                                </SelectTrigger>
                                <SelectContent>
                                    {REFUND_REASONS.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Description détaillée <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                placeholder="Expliquez en détail la raison de votre demande de remboursement..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isLoading}
                                rows={6}
                                className="resize-none"
                                required
                            />
                            <p className="text-xs text-foreground/60">
                                Minimum 10 caractères • {description.length} caractères
                            </p>
                        </div>

                        {/* Important Notice */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Conditions de remboursement</AlertTitle>
                            <AlertDescription className="text-sm space-y-2">
                                <p>
                                    • Les demandes frauduleuses peuvent entraîner la suspension du compte
                                </p>
                                <p>
                                    • Le montant demandé ne peut pas dépasser votre solde disponible
                                </p>
                                <p>
                                    • Les remboursements sont effectués vers votre compte bancaire enregistré
                                </p>
                            </AlertDescription>
                        </Alert>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Soumettre la demande
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <CardHeader>
                    <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/70 space-y-2">
                    <p>
                        Si vous avez des questions concernant le processus de remboursement, 
                        n'hésitez pas à contacter notre support :
                    </p>
                    <p className="font-semibold text-foreground">
                        📧 contact@flashrend.site
                    </p>
                    <p className="font-semibold text-foreground">
                        📞 +33 (0)1 23 45 67 89
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
