"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

type Deposit = {
    id: string;
    amount: number;
    reference: string;
    transferDate: Date;
    status: "PENDING" | "APPROVED" | "REJECTED";
    proofImageUrl: string | null;
    adminNote: string | null;
    processedAt: Date | null;
    createdAt: Date;
};

const STATUS_CONFIG = {
    PENDING: {
        label: "En attente",
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    },
    APPROVED: {
        label: "Approuvé",
        className: "bg-green-500/10 text-green-500 border-green-500/30",
    },
    REJECTED: {
        label: "Rejeté",
        className: "bg-red-500/10 text-red-500 border-red-500/30",
    },
};

export default function BankTransferHistoryPage() {
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const response = await fetch("/api/deposit/bank-transfer/list");
            if (response.ok) {
                const data = await response.json();
                setDeposits(data.deposits);
            }
        } catch (error) {
            console.error("Error fetching deposits:", error);
        } finally {
            setIsLoading(false);
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
        <div className="container max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/account/deposit/bank-transfer">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Historique des virements</h1>
                    <p className="text-foreground/60 mt-1">
                        Consultez l'état de vos dépôts par virement
                    </p>
                </div>
            </div>

            {deposits.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-foreground/60">Aucun dépôt par virement pour le moment</p>
                        <Button className="mt-4" asChild>
                            <Link href="/account/deposit/bank-transfer">
                                Effectuer un dépôt
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {deposits.map((deposit) => (
                        <Card key={deposit.id}>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {deposit.amount.toFixed(2)}€
                                        </CardTitle>
                                        <CardDescription>
                                            Référence: {deposit.reference}
                                        </CardDescription>
                                    </div>
                                    <Badge className={STATUS_CONFIG[deposit.status].className}>
                                        {STATUS_CONFIG[deposit.status].label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-foreground/60">Date du virement</p>
                                        <p className="font-medium">
                                            {format(new Date(deposit.transferDate), "dd MMMM yyyy", {
                                                locale: fr,
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-foreground/60">Date de soumission</p>
                                        <p className="font-medium">
                                            {format(new Date(deposit.createdAt), "dd MMM yyyy HH:mm", {
                                                locale: fr,
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {deposit.proofImageUrl && (
                                    <div>
                                        <p className="text-sm text-foreground/60 mb-1">Preuve de virement</p>
                                        <a
                                            href={deposit.proofImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-amber-500 hover:underline flex items-center gap-1"
                                        >
                                            Voir la capture
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}

                                {deposit.status !== "PENDING" && deposit.processedAt && (
                                    <div className="pt-3 border-t">
                                        <p className="text-sm text-foreground/60 mb-1">
                                            Traité le{" "}
                                            {format(new Date(deposit.processedAt), "dd MMM yyyy à HH:mm", {
                                                locale: fr,
                                            })}
                                        </p>
                                        {deposit.adminNote && (
                                            <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-foreground/60 mb-1">
                                                    Note de l'administrateur
                                                </p>
                                                <p className="text-sm">{deposit.adminNote}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
