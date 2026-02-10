"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RefundRequest = {
    id: string;
    amount: number;
    reason: string;
    description: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING";
    adminResponse: string | null;
    processedAt: Date | null;
    createdAt: Date;
};

const STATUS_CONFIG = {
    PENDING: {
        label: "En attente",
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    },
    PROCESSING: {
        label: "En traitement",
        icon: Loader2,
        className: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    },
    APPROVED: {
        label: "Approuvée",
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-500 border-green-500/30",
    },
    REJECTED: {
        label: "Rejetée",
        icon: XCircle,
        className: "bg-red-500/10 text-red-500 border-red-500/30",
    },
};

const REASON_LABELS: Record<string, string> = {
    technical_issue: "Problème technique",
    unauthorized_transaction: "Transaction non autorisée",
    service_not_received: "Service non reçu",
    investment_issue: "Problème d'investissement",
    other: "Autre raison",
};

export default function RefundHistoryPage() {
    const { user } = useUser();
    const router = useRouter();
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRefundRequests();
        }
    }, [user]);

    const fetchRefundRequests = async () => {
        try {
            const response = await fetch("/api/refund/list");
            if (!response.ok) throw new Error("Erreur lors du chargement");

            const data = await response.json();
            setRefundRequests(data.refundRequests);
        } catch (error) {
            console.error("Error fetching refund requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-foreground/60">Veuillez vous connecter...</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Historique des demandes</h1>
                    <p className="text-foreground/60 mt-1">
                        Consultez l'état de vos demandes de remboursement
                    </p>
                </div>
                <Link href="/account/refund">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Nouvelle demande
                    </Button>
                </Link>
            </div>

            {/* Refund Requests List */}
            {refundRequests.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FileText className="h-16 w-16 text-foreground/20 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            Aucune demande de remboursement
                        </h3>
                        <p className="text-foreground/60 text-center mb-6">
                            Vous n'avez pas encore soumis de demande de remboursement
                        </p>
                        <Link href="/account/refund">
                            <Button>Créer une demande</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {refundRequests.map((request) => {
                        const statusConfig = STATUS_CONFIG[request.status];
                        const StatusIcon = statusConfig.icon;

                        return (
                            <Card key={request.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="text-xl">
                                                    {request.amount.toFixed(2)}€
                                                </CardTitle>
                                                <Badge className={statusConfig.className}>
                                                    <StatusIcon className="mr-1 h-3 w-3" />
                                                    {statusConfig.label}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                {REASON_LABELS[request.reason] || request.reason}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right text-sm text-foreground/60">
                                            <p>
                                                {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="text-xs">
                                                {new Date(request.createdAt).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Description */}
                                    {request.description && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2">Description</h4>
                                            <p className="text-sm text-foreground/70 bg-muted/50 p-3 rounded-lg">
                                                {request.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Admin Response */}
                                    {request.adminResponse && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2">Réponse de l'équipe</h4>
                                            <p className="text-sm text-foreground/70 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                                                {request.adminResponse}
                                            </p>
                                        </div>
                                    )}

                                    {/* Processed Date */}
                                    {request.processedAt && (
                                        <div className="text-xs text-foreground/60">
                                            Traitée le{" "}
                                            {new Date(request.processedAt).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
