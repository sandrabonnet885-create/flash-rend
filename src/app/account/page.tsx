"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Bienvenue sur votre compte FlashRend
                </h1>
                <p className="text-foreground/60">
                    Gérez vos investissements et suivez vos rendements en temps
                    réel
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-foreground/70">
                            Solde total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€0,00</div>
                        <p className="text-xs text-foreground/50 mt-1">
                            Vos fonds investis
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
                            €0,00
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            Nouvel investissement
                        </CardTitle>
                        <CardDescription>
                            Lancez une nouvelle session d'investissement
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
                            <Wallet className="h-5 w-5 text-amber-500" />
                            Gérer votre portefeuille
                        </CardTitle>
                        <CardDescription>
                            Consultez et modifiez vos investissements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/account/portfolio">
                            <Button
                                variant="outline"
                                className="w-full border-white/20 hover:bg-white/10"
                            >
                                Voir le portefeuille
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-white/10 bg-white/5">
                <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                    <CardDescription>
                        Vos 5 dernières transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-foreground/60">
                        <p>Aucune activité pour le moment</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
