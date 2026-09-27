"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Investment = {
    id: string;
    amount: number;
    potentialReturn: number;
    createdAt: Date;
    status: string;
}

export function PerformanceChart({ investments }: { investments: Investment[] }) {
    const data = useMemo(() => {
        // Group by day. Sort by date first to compute cumulative.
        const sorted = [...investments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        let cumulativeInvested = 0;
        let cumulativeReturn = 0;
        
        const grouped = sorted.reduce((acc, inv) => {
            const day = format(new Date(inv.createdAt), 'yyyy-MM-dd');
            if (!acc[day]) {
                acc[day] = {
                    date: day,
                    displayDate: format(new Date(inv.createdAt), 'dd MMM', { locale: fr }),
                    investi: 0,
                    valeurLatente: 0,
                    cumulativeInvested: 0,
                    cumulativeReturn: 0
                }
            }
            acc[day].investi += inv.amount;
            acc[day].valeurLatente += inv.potentialReturn;
            return acc;
        }, {} as Record<string, any>);
        
        // Compute cumulative
        const result = Object.values(grouped).map((day: any) => {
            cumulativeInvested += day.investi;
            cumulativeReturn += day.valeurLatente;
            return {
                ...day,
                cumulativeInvested,
                cumulativeReturn
            };
        });
        
        return result;
    }, [investments]);

    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                Aucune donnée d'investissement.
            </div>
        );
    }

    const formatCurrency = (value: number) => {
         return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis 
                    dataKey="displayDate" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888' }}
                    minTickGap={30}
                    dy={10}
                />
                <YAxis 
                    hide 
                    domain={['auto', 'auto']}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                    formatter={(value: number, name: string) => {
                        const label = name === "cumulativeReturn" ? "Valeur Latente" : "Total Investi";
                        return [formatCurrency(value), label];
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="cumulativeReturn" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorReturn)" 
                    name="cumulativeReturn"
                />
                <Area 
                    type="monotone" 
                    dataKey="cumulativeInvested" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                    name="cumulativeInvested"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
