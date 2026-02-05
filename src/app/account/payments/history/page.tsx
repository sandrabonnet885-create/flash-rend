import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const transactions = await prisma.transaction.findMany({
        where: { user: { clerkId: user.id } },
        orderBy: { createdAt: "desc" },
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Historique des Paiements</h1>
                <p className="text-foreground/60">
                    Consultez l'historique complet de vos transactions
                </p>
            </div>

            <Card className="border-white/10 bg-white/5">
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                        Total: {transactions.length} transaction(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-foreground/70">Type</TableHead>
                                <TableHead className="text-foreground/70">Description</TableHead>
                                <TableHead className="text-foreground/70">Date</TableHead>
                                <TableHead className="text-foreground/70">Statut</TableHead>
                                <TableHead className="text-right text-foreground/70">Montant</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
                                        Aucune transaction trouvée
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {tx.type === 'DEPOSIT' && <ArrowDownLeft className="h-4 w-4 text-green-500" />}
                                                {tx.type === 'WITHDRAWAL' && <ArrowUpRight className="h-4 w-4 text-red-500" />}
                                                {(tx.type !== 'DEPOSIT' && tx.type !== 'WITHDRAWAL') && <Wallet className="h-4 w-4 text-blue-500" />}
                                                <span className="capitalize text-sm">{tx.type.toLowerCase().replace('_', ' ')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {tx.description || "-"}
                                            {tx.reference && <div className="text-xs text-foreground/40 mt-1">Ref: {tx.reference}</div>}
                                        </TableCell>
                                        <TableCell className="text-foreground/60">
                                            {new Date(tx.createdAt).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                tx.status === 'COMPLETED' ? 'default' :
                                                tx.status === 'PENDING' ? 'secondary' : 'destructive'
                                            }>
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${
                                            tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-foreground'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? '+' : ''}
                                            {formatCurrency(tx.amount)}
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
