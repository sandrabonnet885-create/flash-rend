"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
    return (
        <AuthenticateWithRedirectCallback
            afterSignInUrl="/account"
            afterSignUpUrl="/account"
        />
    );
}
