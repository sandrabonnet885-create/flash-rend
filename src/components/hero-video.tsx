"use client";

import { useRef, useState } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

type HeroVideoProps = {
    src: string;
    poster: string;
    label: string;
};

// Vidéo de démo : poster + bouton lecture au centre ; le clic lance la vidéo avec le son.
// Rien n'est téléchargé avant le clic (preload="none").
export default function HeroVideo({ src, poster, label }: HeroVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const play = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = false;
        video.play();
        setStarted(true);
    };

    return (
        <div className="relative mt-12 sm:mt-16 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
            <video
                ref={videoRef}
                className="block w-full aspect-video"
                src={src}
                poster={poster}
                preload="none"
                playsInline
                controls={started}
                onEnded={() => setStarted(false)}
                aria-label={label}
            />

            {!started && (
                <button
                    type="button"
                    onClick={play}
                    aria-label="Lancer la vidéo de démonstration avec le son"
                    className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 transition-colors hover:bg-black/20 focus-visible:outline-none"
                >
                    <span className="relative flex size-16 sm:size-20 items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                        <span className="relative flex size-16 sm:size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-amber-500/40 transition-transform group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-primary/50">
                            <IconPlayerPlayFilled className="size-7 sm:size-9 translate-x-0.5" />
                        </span>
                    </span>
                    <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur">
                        Voir la démo · 1 min
                    </span>
                </button>
            )}
        </div>
    );
}
