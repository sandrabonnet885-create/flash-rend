"use client";

import { useEffect, useMemo, useState } from "react";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    ReferenceLine
} from "recharts";
import { format } from "date-fns";
import { generateInvestmentTimeline } from "@/lib/chart-utils";
import { TrendingUp, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActiveInvestment = {
    id: string;
    createdAt: string;
    endsAt: string;
    amount: number;
    potentialReturn: number;
    multiplier: number;
};

export default function LiveInvestmentChart({ investment }: { investment: ActiveInvestment }) {
    const [now, setNow] = useState(new Date().getTime());

    // Generate the full determinisitc timeline once
    const fullTimeline = useMemo(() => {
        return generateInvestmentTimeline(
            investment.id,
            investment.amount,
            investment.potentialReturn,
            investment.createdAt,
            investment.endsAt,
            60 // 60 points for the chart
        );
    }, [investment]);

    // Timer to update 'now' every second
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().getTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format data for Recharts: future points have value = null so they aren't drawn yet
    const chartData = useMemo(() => {
        return fullTimeline.map(point => ({
            timeLabel: format(point.time, "HH:mm"),
            value: now >= point.timestamp ? point.value : null,
            targetLine: investment.potentialReturn,
            timestamp: point.timestamp
        }));
    }, [fullTimeline, now, investment.potentialReturn]);

    // Find current estimated value (the last non-null value)
    const currentValue = useMemo(() => {
        const pastPoints = chartData.filter(d => d.value !== null);
        if (pastPoints.length === 0) return investment.amount;
        return pastPoints[pastPoints.length - 1].value as number;
    }, [chartData, investment.amount]);

    // Calculate time left
    const endTime = new Date(investment.endsAt).getTime();
    const diff = endTime - now;
    const isCompleted = diff <= 0;
    
    const minutesLeft = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const secondsLeft = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
    const timeLeftStr = isCompleted ? "0m 0s" : `${minutesLeft}m ${secondsLeft}s`;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    const progressPercent = Math.min(100, Math.max(0, ((now - new Date(investment.createdAt).getTime()) / (endTime - new Date(investment.createdAt).getTime())) * 100));

    return (
        <Card className="border-green-500/30 bg-linear-to-b from-green-500/5 to-transparent overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                <div 
                    className="h-full bg-green-500 transition-all duration-1000 ease-linear" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className=" flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-500 animate-pulse" />
                        Investissement Actif
                        <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                            x{investment.multiplier}
                        </Badge>
                    </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
                    <Clock className="h-4 w-4" />
                    <span>{timeLeftStr}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Mise Initiale</p>
                        <p className="text-xl font-semibold">{formatCurrency(investment.amount)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Cible Estimée</p>
                        <p className="text-xl font-bold text-green-600/70">{formatCurrency(investment.potentialReturn)}</p>
                    </div>
                    <div className="md:col-span-2 text-right">
                        <p className="text-sm text-muted-foreground mb-1">Valeur Actuelle (Live)</p>
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-400 flex items-center justify-end gap-2">
                            {formatCurrency(currentValue)}
                            <TrendingUp className="h-6 w-6 text-green-500" />
                        </p>
                    </div>
                </div>

                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                            <XAxis 
                                dataKey="timeLabel" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#888' }}
                                minTickGap={30}
                            />
                            <YAxis 
                                domain={['dataMin - 10', 'dataMax + 10']} 
                                hide 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#10b981' }}
                                labelStyle={{ color: '#9ca3af' }}
                                formatter={(value: number) => [formatCurrency(value), "Valeur"]}
                            />
                            {/* The Target Line */}
                            <ReferenceLine 
                                y={investment.potentialReturn} 
                                stroke="#10b981" 
                                strokeDasharray="3 3" 
                                strokeOpacity={0.4} 
                                label={{ 
                                    position: 'insideTopLeft', 
                                    value: 'Cible', 
                                    fill: '#10b981',
                                    fontSize: 12,
                                    opacity: 0.8
                                }} 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                                isAnimationActive={false} // Disable animation so it doesn't wobble on every tick
                                connectNulls={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
