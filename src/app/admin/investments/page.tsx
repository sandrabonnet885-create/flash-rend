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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, TrendingUp, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Investment = {
    id: string;
    userId: string;
    amount: number;
    duration: number;
    potentialReturn: number;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    user: {
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
};

const STATUS_CONFIG = {
    ACTIVE: {
        label: "Actif",
        className: "bg-green-500/10 text-green-500 border-green-500/30",
    },
    COMPLETED: {
        label: "Terminé",
        className: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    },
    CANCELLED: {
        label: "Annulé",
        className: "bg-red-500/10 text-red-500 border-red-500/30",
    },
};

export default function AdminInvestmentsPage() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        totalAmount: 0,
        totalReturns: 0,
    });

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            const response = await fetch("/api/admin/investments/list");
            if (response.ok) {
                const data = await response.json();
                setInvestments(data.investments);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching investments:", error);
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
                <h1 className="text-3xl font-bold">Gestion des investissements</h1>
                <p className="text-foreground/60 mt-1">
                    Vue d'ensemble de tous les investissements
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Total investissements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Investissements actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {stats.active}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Montant total investi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalAmount.toFixed(2)}€
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Rendements totaux
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {stats.totalReturns.toFixed(2)}€
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Investments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des investissements</CardTitle>
                    <CardDescription>
                        Tous les investissements de la plateforme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Date de début</TableHead>
                                <TableHead>Durée</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead className="text-right">Rendement</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {investments.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-foreground/60"
                                    >
                                        Aucun investissement trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                investments.map((investment) => (
                                    <TableRow key={investment.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {investment.user.firstName}{" "}
                                                {investment.user.lastName}
                                            </div>
                                            <div className="text-xs text-foreground/60">
                                                {investment.user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {investment.startDate && !isNaN(new Date(investment.startDate).getTime())
                                                ? format(
                                                      new Date(investment.startDate),
                                                      "dd MMM yyyy HH:mm",
                                                      { locale: fr }
                                                  )
                                                : format(
                                                      new Date(investment.createdAt),
                                                      "dd MMM yyyy HH:mm",
                                                      { locale: fr }
                                                  )}
                                        </TableCell>
                                        <TableCell>{investment.duration}h</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {investment.amount.toFixed(2)}€
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-green-500">
                                            +{investment.potentialReturn.toFixed(2)}€
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    STATUS_CONFIG[investment.status]
                                                        .className
                                                }
                                            >
                                                {STATUS_CONFIG[investment.status].label}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
