import { UserButton, SignedIn } from "@clerk/nextjs";

export default function AccountPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
                Bienvenue sur votre compte FlashRend
            </h1>

            <SignedIn>
                <UserButton
                    afterSignOutUrl="/login"
                    showName={true}
                    afterMultiSessionSingleSignOutUrl="/login"
                />
            </SignedIn>
        </div>
    );
}
