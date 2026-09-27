import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 p-4">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full max-w-lg text-center">
                {/* 404 Large Text with individual styling */}
                <div className="flex justify-center items-center mb-12 select-none">
                    <span className="text-[120px] sm:text-[180px] font-bold leading-none text-amber-500 -rotate-12 translate-x-4 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                        4
                    </span>
                    <span className="text-[130px] sm:text-[200px] font-bold leading-none text-white/10 z-10 drop-shadow-2xl">
                        0
                    </span>
                    <span className="text-[120px] sm:text-[180px] font-bold leading-none text-orange-600 rotate-12 -translate-x-4 drop-shadow-[0_0_30px_rgba(234,88,12,0.2)]">
                        4
                    </span>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-amber-500 rounded-2xl shadow-lg ring-4 ring-slate-950">
                        <Search className="h-6 w-6 text-slate-950" />
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-white mt-4">
                        Destination inconnue
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                        Cette transaction vers nulle part a été interceptée. La page que vous cherchez n'existe pas ou a été déplacée.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="flex-1">
                            <Button
                                className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold h-12 shadow-xl shadow-amber-500/10"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Accueil
                            </Button>
                        </Link>
                        <Link href="/account" className="flex-1">
                            <Button
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5 h-12"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Mon Compte
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
