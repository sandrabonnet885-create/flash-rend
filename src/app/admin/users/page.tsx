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
import { Loader2, Users as UsersIcon, TrendingUp, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type User = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    balance: number;
    createdAt: Date;
    _count: {
        investments: number;
        transactions: number;
    };
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        totalBalance: 0,
        activeInvestors: 0,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users/list");
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
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
                <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
                <p className="text-foreground/60 mt-1">
                    Vue d'ensemble de tous les utilisateurs de la plateforme
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <UsersIcon className="h-4 w-4" />
                            Total utilisateurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Investisseurs actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeInvestors}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Solde total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalBalance.toFixed(2)}€
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des utilisateurs</CardTitle>
                    <CardDescription>
                        Tous les utilisateurs enregistrés sur la plateforme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Date d'inscription</TableHead>
                                <TableHead className="text-right">Solde</TableHead>
                                <TableHead className="text-right">Investissements</TableHead>
                                <TableHead className="text-right">Transactions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-foreground/60"
                                    >
                                        Aucun utilisateur trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="text-xs text-foreground/60">
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(user.createdAt),
                                                "dd MMM yyyy",
                                                { locale: fr }
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {user.balance.toFixed(2)}€
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline">
                                                {user._count.investments}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline">
                                                {user._count.transactions}
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
