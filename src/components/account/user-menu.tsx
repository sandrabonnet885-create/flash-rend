"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";

export default function UserMenu() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleSignOut = async () => {
        await signOut({ redirectUrl: "/login" });
    };

    const userName =
        user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.emailAddresses[0]?.emailAddress || "Utilisateur";

    const userInitials =
        (user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "");

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-10 px-3 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg"
                >
                    {user.imageUrl ? (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                                src={user.imageUrl}
                                alt={userName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                                {userInitials}
                            </span>
                        </div>
                    )}
                    <span className="text-sm font-medium text-foreground/80 hidden sm:inline">
                        {userName.split(" ")[0]}
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                {/* User Info */}
                <div className="px-2 py-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                            <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Image
                                    src={user.imageUrl}
                                    alt={userName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {userInitials}
                                </span>
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">
                                {userName}
                            </p>
                            <p className="text-xs text-foreground/60">
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="cursor-pointer text-foreground/80 hover:text-foreground"
                >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/account/settings")}
                    className="cursor-pointer text-foreground/80 hover:text-foreground"
                >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Sign Out */}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-400 hover:text-red-300"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
