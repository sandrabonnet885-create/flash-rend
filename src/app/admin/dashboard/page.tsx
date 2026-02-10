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
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AnalyticsData = {
    users: {
        total: number;
        newToday: number;
        newThisWeek: number;
        newThisMonth: number;
        totalBalance: number;
    };
    investments: {
        total: number;
        active: number;
        completed: number;
        totalAmount: number;
        totalPotentialReturn: number;
    };
    transactions: {
        total: number;
        pending: number;
        totalVolume: number;
        depositsToday: number;
        withdrawalsToday: number;
    };
    refunds: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        totalAmount: number;
    };
};

type Activity = {
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: Date;
    user: {
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
};

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [activities, setActivities] = useState<{
        transactions: Activity[];
        investments: Activity[];
        refunds: Activity[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [analyticsRes, activitiesRes] = await Promise.all([
                fetch("/api/admin/analytics/overview"),
                fetch("/api/admin/analytics/activities"),
            ]);

            if (analyticsRes.ok && activitiesRes.ok) {
                const analyticsData = await analyticsRes.json();
                const activitiesData = await activitiesRes.json();
                setAnalytics(analyticsData);
                setActivities(activitiesData);
                setLastRefresh(new Date());
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading && !analytics) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-foreground/60">Erreur de chargement</p>
            </div>
        );
    }

    const statCards = [
        {
            title: "Utilisateurs",
            value: analytics.users.total.toLocaleString(),
            change: `+${analytics.users.newToday} aujourd'hui`,
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Investissements actifs",
            value: analytics.investments.active.toLocaleString(),
            change: `${analytics.investments.total} au total`,
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Volume de transactions",
            value: `${analytics.transactions.totalVolume.toFixed(2)}€`,
            change: `${analytics.transactions.total} transactions`,
            icon: Activity,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Solde total utilisateurs",
            value: `${analytics.users.totalBalance.toFixed(2)}€`,
            change: `${analytics.transactions.pending} en attente`,
            icon: DollarSign,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            Dashboard Admin
                        </h1>
                        <p className="text-foreground/60 mt-1 text-sm">
                            Vue d'ensemble des activités et statistiques
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-xs sm:text-sm text-foreground/60 hidden sm:block">
                            Dernière mise à jour:{" "}
                            {lastRefresh.toLocaleTimeString("fr-FR")}
                        </p>
                        <Button
                            onClick={fetchData}
                            disabled={isLoading}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCcw
                                className={`h-4 w-4 sm:mr-2 ${isLoading ? "animate-spin" : ""}`}
                            />
                            <span className="hidden sm:inline">Actualiser</span>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-foreground/70">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-foreground/60 mt-1">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Utilisateurs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistiques utilisateurs</CardTitle>
                            <CardDescription>
                                Croissance et activité des utilisateurs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Nouveaux aujourd'hui
                                </span>
                                <Badge variant="outline">
                                    {analytics.users.newToday}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Nouveaux cette semaine
                                </span>
                                <Badge variant="outline">
                                    {analytics.users.newThisWeek}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Nouveaux ce mois
                                </span>
                                <Badge variant="outline">
                                    {analytics.users.newThisMonth}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-semibold">
                                    Total utilisateurs
                                </span>
                                <span className="text-lg font-bold text-amber-500">
                                    {analytics.users.total}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Investissements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistiques investissements</CardTitle>
                            <CardDescription>
                                Aperçu des investissements
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Investissements actifs
                                </span>
                                <Badge className="bg-green-500/10 text-green-500">
                                    {analytics.investments.active}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Investissements terminés
                                </span>
                                <Badge variant="outline">
                                    {analytics.investments.completed}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Montant total investi
                                </span>
                                <span className="text-sm font-semibold">
                                    {analytics.investments.totalAmount.toFixed(2)}€
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-semibold">
                                    Rendements potentiels
                                </span>
                                <span className="text-lg font-bold text-green-500">
                                    {analytics.investments.totalPotentialReturn.toFixed(2)}€
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>
                                Dépôts et retraits du jour
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-foreground/70">
                                        Dépôts aujourd'hui
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-green-500">
                                    +{analytics.transactions.depositsToday.toFixed(2)}€
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-foreground/70">
                                        Retraits aujourd'hui
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-red-500">
                                    -{analytics.transactions.withdrawalsToday.toFixed(2)}€
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Transactions en attente
                                </span>
                                <Badge className="bg-yellow-500/10 text-yellow-500">
                                    {analytics.transactions.pending}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-semibold">
                                    Volume total
                                </span>
                                <span className="text-lg font-bold text-amber-500">
                                    {analytics.transactions.totalVolume.toFixed(2)}€
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Remboursements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Demandes de remboursement</CardTitle>
                            <CardDescription>
                                État des demandes de remboursement
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    En attente
                                </span>
                                <Badge className="bg-yellow-500/10 text-yellow-500">
                                    {analytics.refunds.pending}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Approuvées
                                </span>
                                <Badge className="bg-green-500/10 text-green-500">
                                    {analytics.refunds.approved}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">
                                    Rejetées
                                </span>
                                <Badge className="bg-red-500/10 text-red-500">
                                    {analytics.refunds.rejected}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-semibold">
                                    Montant total demandé
                                </span>
                                <span className="text-lg font-bold text-amber-500">
                                    {analytics.refunds.totalAmount.toFixed(2)}€
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                {activities && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Activités récentes</CardTitle>
                            <CardDescription>
                                Dernières transactions et investissements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activities.transactions.slice(0, 5).map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-muted/30 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Activity className="h-4 w-4 text-foreground/60 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">
                                                    {transaction.user.email}
                                                </p>
                                                <p className="text-xs text-foreground/60">
                                                    {transaction.type} •{" "}
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleString("fr-FR")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right">
                                            <p className="text-sm font-semibold">
                                                {transaction.amount.toFixed(2)}€
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {transaction.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
