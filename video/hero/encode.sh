#!/usr/bin/env bash
# Assemblage des vidéos à partir des images rendues (out/frames*) et de l'audio (out/music*.wav, out/vo*.wav).
#   bash video/hero/encode.sh                          30 s, 16:9 (hero du site + version sonore)
#   FORMAT=v bash video/hero/encode.sh                 30 s, 9:16
#   VERSION=60 bash video/hero/encode.sh               60 s, 16:9 -> demo60.mp4
#   VERSION=60 FORMAT=v bash video/hero/encode.sh      60 s, 9:16 -> demo60-vertical.mp4
# Sorties dans out/ :
#   hero.mp4        30 s, 16:9, H.264 qualité, muet (archive, montage)
#   hero-web.mp4    30 s, 16:9, H.264 léger, muet, pour le hero du site (fallback Safari)
#   hero.webm       30 s, 16:9, VP9 léger, muet, pour le hero du site
#   hero-son.mp4    30 s, 16:9, avec musique, effets et voix off
#   hero-poster.jpg image fixe (prefers-reduced-motion, chargement)
#   hero-vertical.mp4 / hero-vertical-son.mp4      30 s, 9:16
#   demo60.mp4 / demo60-vertical.mp4               60 s, avec son
set -euo pipefail
cd "$(dirname "$0")/out"
FFMPEG="${FFMPEG:-ffmpeg}"
VERSION="${VERSION:-30}"
FORMAT="${FORMAT:-h}"

SFX=""
FRAMES="frames"
if [ "$VERSION" != "30" ]; then SFX="$VERSION"; FRAMES="$FRAMES-$VERSION"; fi
if [ "$FORMAT" = "v" ]; then FRAMES="$FRAMES-v"; fi
DUR=$VERSION
IN=(-framerate 30 -i "$FRAMES/%04d.jpg")

# Mixage : la musique s'efface sous la voix (sidechain), normalisation -14 LUFS, fondu final.
sound() {
    local out="$1" crf="$2"
    local graph="[2:a]asplit=2[vo][sc];[1:a][sc]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=400:makeup=1[m];[m][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9,afade=t=out:st=$((DUR - 1)):d=1[a]"
    "$FFMPEG" -v error -y "${IN[@]}" -i "music$SFX.wav" -i "vo$SFX.wav" -filter_complex "$graph" -map 0:v -map "[a]" \
        -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 \
        -movflags +faststart -t "$DUR" "$out"
}

if [ "$VERSION" = "60" ]; then
    if [ "$FORMAT" = "v" ]; then sound demo60-vertical.mp4 20; ls -la demo60-vertical.mp4
    else sound demo60.mp4 19; ls -la demo60.mp4; fi
    exit 0
fi

if [ "$FORMAT" = "v" ]; then
    "$FFMPEG" -v error -y "${IN[@]}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
        -movflags +faststart -an -t "$DUR" hero-vertical.mp4
    sound hero-vertical-son.mp4 20
    ls -la hero-vertical.mp4 hero-vertical-son.mp4
    exit 0
fi

"$FFMPEG" -v error -y "${IN[@]}" -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
    -movflags +faststart -an -t "$DUR" hero.mp4

"$FFMPEG" -v error -y "${IN[@]}" -c:v libx264 -preset slow -crf 27 -maxrate 1800k -bufsize 3600k \
    -pix_fmt yuv420p -movflags +faststart -an -t "$DUR" hero-web.mp4

"$FFMPEG" -v error -y "${IN[@]}" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 \
    -pix_fmt yuv420p -an -t "$DUR" hero.webm

sound hero-son.mp4 18

# Poster : le tableau de bord pendant le suivi (21 s).
cp "$FRAMES/0630.jpg" hero-poster.jpg

ls -la hero*.mp4 hero.webm hero-poster.jpg
