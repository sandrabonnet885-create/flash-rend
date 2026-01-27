"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Wallet,
    TrendingUp,
    Settings,
    BarChart3,
    CreditCard,
    Eye,
} from "lucide-react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Vue d'ensemble",
        icon: Home,
        href: "/account",
    },
    {
        title: "Portfolio",
        icon: Wallet,
        href: "/account/portfolio",
    },
    {
        title: "Investissements",
        icon: TrendingUp,
        items: [
            {
                title: "Mes investissements",
                href: "/account/investments",
            },
            {
                title: "Historique",
                href: "/account/investments/history",
            },
            {
                title: "Gains et pertes",
                href: "/account/investments/performance",
            },
        ],
    },
    {
        title: "Paiements",
        icon: CreditCard,
        items: [
            {
                title: "Dépôts",
                href: "/account/payments/deposits",
            },
            {
                title: "Retraits",
                href: "/account/payments/withdrawals",
            },
            {
                title: "Historique",
                href: "/account/payments/history",
            },
        ],
    },
    {
        title: "Analytique",
        icon: BarChart3,
        href: "/account/analytics",
    },
    {
        title: "Suivi",
        icon: Eye,
        href: "/account/watchlist",
    },
    {
        title: "Paramètres",
        icon: Settings,
        href: "/account/settings",
    },
];

export default function AccountSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/account") {
            return pathname === "/account";
        }
        return pathname.startsWith(href);
    };

    return (
        <SidebarMenu>
            {menuItems.map((item) => (
                <div key={item.title}>
                    {item.items ? (
                        // Menu item with sub-items
                        <div className="group/collapsible">
                            <button
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                                    "text-foreground/70 hover:text-foreground hover:bg-white/10",
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="flex-1 text-left">
                                    {item.title}
                                </span>
                            </button>

                            {/* Sub-items */}
                            <div className="mt-2 ml-4 space-y-1 border-l border-white/10 pl-3">
                                {item.items.map((subItem) => (
                                    <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                    >
                                        <div
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-sm transition-colors",
                                                isActive(subItem.href)
                                                    ? "text-amber-500 bg-amber-500/10 font-semibold"
                                                    : "text-foreground/60 hover:text-foreground hover:bg-white/10",
                                            )}
                                        >
                                            {subItem.title}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Single menu item
                        <Link href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                                    isActive(item.href)
                                        ? "text-amber-500 bg-amber-500/10"
                                        : "text-foreground/70 hover:text-foreground hover:bg-white/10",
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </div>
                        </Link>
                    )}
                </div>
            ))}
        </SidebarMenu>
    );
}
