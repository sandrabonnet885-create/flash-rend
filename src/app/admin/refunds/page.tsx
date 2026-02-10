"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

type RefundRequest = {
    id: string;
    userId: string;
    amount: number;
    reason: string;
    description: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING";
    adminResponse: string | null;
    createdAt: Date;
    user: {
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
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

export default function AdminRefundsPage() {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRefunds();
    }, []);

    const fetchRefunds = async () => {
        try {
            const response = await fetch("/api/admin/refunds/list");
            if (response.ok) {
                const data = await response.json();
                setRefunds(data.refunds);
            }
        } catch (error) {
            console.error("Error fetching refunds:", error);
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
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Demandes de remboursement</h1>
                <p className="text-foreground/60 mt-1">
                    Gérer les demandes de remboursement des utilisateurs
                </p>
            </div>

            <div className="grid gap-4">
                {refunds.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <p className="text-foreground/60">
                                Aucune demande de remboursement
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    refunds.map((refund) => {
                        const statusConfig = STATUS_CONFIG[refund.status];
                        const StatusIcon = statusConfig.icon;

                        return (
                            <Card key={refund.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-3">
                                                {refund.amount.toFixed(2)}€
                                                <Badge className={statusConfig.className}>
                                                    <StatusIcon className="mr-1 h-3 w-3" />
                                                    {statusConfig.label}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                {refund.user.email} •{" "}
                                                {new Date(refund.createdAt).toLocaleString(
                                                    "fr-FR"
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">
                                            Raison
                                        </h4>
                                        <p className="text-sm text-foreground/70">
                                            {refund.reason}
                                        </p>
                                    </div>
                                    {refund.description && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2">
                                                Description
                                            </h4>
                                            <p className="text-sm text-foreground/70 bg-muted/50 p-3 rounded-lg">
                                                {refund.description}
                                            </p>
                                        </div>
                                    )}
                                    {refund.status === "PENDING" && (
                                        <div className="flex gap-2 pt-4">
                                            <Button
                                                size="sm"
                                                className="bg-green-500 hover:bg-green-600"
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Approuver
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Rejeter
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
