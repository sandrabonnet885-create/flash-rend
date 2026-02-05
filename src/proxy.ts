import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAccountRoute = createRouteMatcher(["/account(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

export default clerkMiddleware(async (auth, req) => {
    // 1. /account* → Authentification requise
    if (isAccountRoute(req)) {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    }

    // 2. /dashboard* → Auth requise (vérification admin faite dans le layout)
    if (isDashboardRoute(req)) {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
});
