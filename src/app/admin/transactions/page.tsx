import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WithdrawalActions } from "./_components/withdrawal-actions";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
    const pendingWithdrawals = await prisma.transaction.findMany({
        where: {
            type: "WITHDRAWAL",
            status: "PENDING",
        },
        include: {
            user: true,
            bankAccount: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Gestion des transactions</h1>
                <p className="text-foreground/60 mt-1">
                    Validez ou refusez les demandes de retrait
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Demandes en attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingWithdrawals.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Retraits en attente</CardTitle>
                    <CardDescription>Validez ou refusez les demandes de retrait.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Compte Bancaire</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingWithdrawals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Aucune demande en attente
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingWithdrawals.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>
                                            {format(new Date(tx.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{tx.user.firstName} {tx.user.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{tx.user.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{tx.bankAccount?.bankName}</div>
                                            <div className="text-xs text-muted-foreground">{tx.bankAccount?.iban}</div>
                                            <div className="text-xs text-muted-foreground">{tx.bankAccount?.accountHolder}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {formatCurrency(tx.amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <WithdrawalActions transactionId={tx.id} />
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
