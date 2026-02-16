import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, History } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BonusClaimCard } from "@/components/bonus-claim-card";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        include: {
            transactions: {
                take: 5,
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!dbUser) {
        // Fallback if webhook hasn't fired yet
        return <div>Configuration du compte en cours...</div>;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Bienvenue, {dbUser.firstName || user.firstName}
                </h1>
                <p className="text-foreground/60">
                    Gérez vos investissements et suivez vos rendements en temps
                    réel
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors md:hidden">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            Investir
                        </CardTitle>
                        <CardDescription>
                            Lancez un nouvel investissement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/account/investments">
                            <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                                Commencer
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-foreground/70">
                            Solde total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(dbUser.balance)}
                        </div>
                        <p className="text-xs text-foreground/50 mt-1">
                            Vos fonds disponibles
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-foreground/70">
                            Gains
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {formatCurrency(0)}
                        </div>
                        <p className="text-xs text-foreground/50 mt-1">
                            +0% ce mois
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-foreground/70">
                            Investissements actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-foreground/50 mt-1">
                            Sessions en cours
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-foreground/70">
                            Rendement moyen
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-foreground/50 mt-1">
                            En attente de données
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Bonus Claim Card - Only shows if not claimed */}
                <BonusClaimCard bonusClaimed={dbUser.bonusClaimed} />

                <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors hidden md:block">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            Investir
                        </CardTitle>
                        <CardDescription>
                            Lancez un nouvel investissement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/account/investments">
                            <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                                Commencer
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowDownLeft className="h-5 w-5 text-green-500" />
                            Dépôt
                        </CardTitle>
                        <CardDescription>
                            Ajouter des fonds par virement bancaire
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/account/deposit/bank-transfer">
                            <Button
                                variant="outline"
                                className="w-full border-white/20 hover:bg-white/10"
                            >
                                Effectuer un dépôt
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Stripe Payment - Commented out */}
                {/* <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowDownLeft className="h-5 w-5 text-green-500" />
                            Dépôt Stripe
                        </CardTitle>
                        <CardDescription>
                            Ajouter des fonds à votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/account/payments">
                            <Button
                                variant="outline"
                                className="w-full border-white/20 hover:bg-white/10"
                            >
                                Ajouter des fonds
                            </Button>
                        </Link>
                    </CardContent>
                </Card> */}

                 <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History className="h-5 w-5 text-blue-500" />
                            Historique
                        </CardTitle>
                        <CardDescription>
                            Voir toutes vos transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/account/payments/history">
                            <Button
                                variant="outline"
                                className="w-full border-white/20 hover:bg-white/10"
                            >
                                Voir l'historique
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-white/10 bg-white/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Activité récente</CardTitle>
                            <CardDescription>
                                Vos 5 dernières transactions
                            </CardDescription>
                        </div>
                        <Link href="/account/payments/history">
                            <Button variant="ghost" size="sm">
                                Voir tout <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {dbUser.transactions.length === 0 ? (
                        <div className="text-center py-8 text-foreground/60">
                            <p>Aucune activité pour le moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dbUser.transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${
                                            tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-500' :
                                            tx.type === 'WITHDRAWAL' ? 'bg-red-500/20 text-red-500' :
                                            'bg-blue-500/20 text-blue-500'
                                        }`}>
                                            {tx.type === 'DEPOSIT' && <ArrowDownLeft className="h-4 w-4" />}
                                            {tx.type === 'WITHDRAWAL' && <ArrowUpRight className="h-4 w-4" />}
                                            {(tx.type !== 'DEPOSIT' && tx.type !== 'WITHDRAWAL') && <Wallet className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {tx.description || tx.type}
                                            </p>
                                            <p className="text-xs text-foreground/50">
                                                {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${
                                            tx.type === 'DEPOSIT' ? 'text-green-500' : 
                                            tx.type === 'WITHDRAWAL' ? 'text-foreground' : 'text-blue-500'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? '+' : ''}
                                            {formatCurrency(tx.amount)}
                                        </p>
                                        <Badge variant={
                                            tx.status === 'COMPLETED' ? 'default' :
                                            tx.status === 'PENDING' ? 'secondary' : 'destructive'
                                        } className="text-[10px] h-5">
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
