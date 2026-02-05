import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Euro, PieChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
    const user = await currentUser();
    if (!user) return null;

    const investments = await prisma.investment.findMany({
        where: { user: { clerkId: user.id } },
    });

    const totalInvested = investments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPotentialValue = investments.reduce((acc, curr) => acc + curr.potentialReturn, 0);
    const totalGain = totalPotentialValue - totalInvested;
    const averageMultiplier = investments.length > 0 
        ? investments.reduce((acc, curr) => acc + curr.multiplier, 0) / investments.length 
        : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    return (
        <div className="container mx-auto px-4 py-8">
             <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Performance</h1>
                <p className="text-muted-foreground">
                    Analyse détaillée de votre portefeuille.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Investi</CardTitle>
                        <Euro className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valeur Latente</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPotentialValue)}</div>
                        <p className="text-xs text-muted-foreground">
                            + {totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(1) : 0}% de rendement
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Multiplicateur Moyen</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">x{averageMultiplier.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                     <CardTitle>Répartition</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Graphiques de performance à venir...
                </CardContent>
            </Card>
        </div>
    );
}
