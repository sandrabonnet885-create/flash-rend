"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    CreditCard,
    RefreshCcw,
    Settings,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminMenuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
    },
    {
        title: "Utilisateurs",
        icon: Users,
        href: "/admin/users",
    },
    {
        title: "Investissements",
        icon: TrendingUp,
        href: "/admin/investments",
    },
    {
        title: "Transactions",
        icon: CreditCard,
        href: "/admin/transactions",
    },
    {
        title: "Remboursements",
        icon: RefreshCcw,
        href: "/admin/refunds",
    },
    {
        title: "Paramètres",
        icon: Settings,
        href: "/admin/settings",
    },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-foreground/60 mt-1">
                        FlashRend Administration
                    </p>
                </div>

                <nav className="px-3 space-y-1">
                    {adminMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-amber-500/10 text-amber-500"
                                            : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-3 right-3">
                    <Link href="/account">
                        <Button variant="outline" className="w-full" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour au compte
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
