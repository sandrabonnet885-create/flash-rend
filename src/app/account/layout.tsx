"use client";

import { ReactNode } from "react";
import { SignedIn } from "@clerk/nextjs";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AccountSidebar from "@/components/account/account-sidebar";
import UserMenu from "@/components/account/user-menu";

export default function AccountLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen bg-slate-950">
                {/* Sidebar */}
                <Sidebar className="border-r border-white/10">
                    <SidebarHeader>
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                FlashRend
                            </h2>
                        </div>
                        <Separator className="bg-white/10" />
                    </SidebarHeader>

                    <SidebarContent>
                        <AccountSidebar />
                    </SidebarContent>
                </Sidebar>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm p-4">
                        <div className="flex items-center justify-between">
                            <SidebarTrigger />
                            <h1 className="text-lg font-semibold text-foreground">
                                Mon Compte
                            </h1>
                            <SignedIn>
                                <UserMenu />
                            </SignedIn>
                        </div>
                    </div>

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
