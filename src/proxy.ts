import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAccountRoute = createRouteMatcher(["/account(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "votre-email@exemple.com"];

export default clerkMiddleware(async (auth, req) => {
    // 1. /account* → Authentification requise
    if (isAccountRoute(req)) {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    }

    // 2. /dashboard* → Auth + admin par email
    if (isDashboardRoute(req)) {
        const { userId, sessionClaims } = await auth();

        if (!userId) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // ✅ CORRECTION : Accès sécurisé à l'email
        let userEmail: string | undefined;

        if (sessionClaims?.email) {
            userEmail = sessionClaims.email as string;
        } else if (Array.isArray(sessionClaims?.email_addresses)) {
            userEmail = sessionClaims.email_addresses[0]?.email_address as
                | string
                | undefined;
        }

        const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

        if (!isAdmin) {
            return NextResponse.redirect(
                new URL("/account?error=admin_required", req.url),
            );
        }

        return NextResponse.next();
    }

    return NextResponse.next();
});
