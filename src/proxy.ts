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

export const config = {
    matcher: [
        /**
         * Sans matcher, `clerkMiddleware` s'exécutait sur *toutes* les requêtes,
         * y compris /sitemap.xml et /robots.txt : le handshake Clerk y déclenchait
         * une redirection avant l'affichage du fichier. On exclut donc les
         * internes Next, les fichiers statiques et les routes de métadonnées SEO.
         */
        "/((?!_next/|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|opengraph-image|twitter-image|.*\\.(?:css|js|mjs|map|jpe?g|png|gif|webp|avif|svg|ico|ttf|otf|woff2?|txt|xml|webmanifest)$).*)",
        // Les routes API restent protégées.
        "/(api|trpc)(.*)",
    ],
};
