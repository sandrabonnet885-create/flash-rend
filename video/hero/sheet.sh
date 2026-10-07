#!/usr/bin/env bash
# Planche de contrôle : sheet.sh <sortie.png> <colonnes> <image1> <image2> ...
set -euo pipefail
FFMPEG="${FFMPEG:-ffmpeg}"
out="$1"; cols="$2"; shift 2
n=$#
rows=$(( (n + cols - 1) / cols ))
list=$(mktemp)
for f in "$@"; do printf "file '%s'\n" "$(cd "$(dirname "$f")" && pwd -W 2>/dev/null || pwd)/$(basename "$f")" >> "$list"; done
"$FFMPEG" -v error -y -f concat -safe 0 -i "$list" -vf "scale=640:-1,tile=${cols}x${rows}:padding=6:color=white" -frames:v 1 "$out"
rm -f "$list"
echo "planche -> $out"
