import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-slate-950">
            {/* Background Gradient Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-r from-amber-500/10 to-orange-600/10 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-l from-amber-500/10 to-orange-600/10 rounded-full blur-3xl opacity-30 animate-pulse" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
                    <Spinner className="h-16 w-16 text-amber-500 relative z-10" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        FlashRend
                    </h2>
                    <p className="text-foreground/40 text-sm font-medium tracking-widest uppercase animate-pulse">
                        Synchronisation en cours...
                    </p>
                </div>
            </div>
        </div>
    );
}
