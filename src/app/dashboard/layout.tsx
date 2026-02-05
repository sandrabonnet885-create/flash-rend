import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log(`[Admin Access Denied] User: ${userEmail}`);
        // Redirect non-admins to their account page
        redirect("/account?error=admin_required");
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="text-sm text-foreground/60">
                        Admin: {user.firstName}
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
