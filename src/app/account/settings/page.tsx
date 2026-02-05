"use client";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 ">
                <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
                <p className="text-muted-foreground">
                    Gérez votre compte, votre sécurité et vos préférences.
                </p>
            </div>

            <div className="flex justify-center">
                <UserProfile 
                    appearance={{
                        elements: {
                            card: "shadow-none border border-border bg-card",
                            navbar: "hidden",
                            navbarMobileMenuButton: "hidden",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                        }
                    }}
                    routing="hash"
                />
            </div>
        </div>
    );
}
