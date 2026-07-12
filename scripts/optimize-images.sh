#!/usr/bin/env bash
# Optimize all JPGs referenced in scripts/image-paths.txt for web delivery.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATHS_FILE="$ROOT/scripts/image-paths.txt"
MAX_WIDTH="${MAX_WIDTH:-1920}"

optimize() {
  local file="$1"
  local width="$2"
  local tmp="${file}.opt.jpg"
  ffmpeg -y -loglevel error -i "$file" \
    -vf "scale='min($width,iw)':-2" \
    -q:v 4 "$tmp"
  mv "$tmp" "$file"
  echo "  optimized $(basename "$file") → $(du -h "$file" | cut -f1)"
}

while IFS= read -r path; do
  [[ -z "$path" || "$path" =~ ^# ]] && continue
  path="${path#/}"
  file="$ROOT/public/$path"
  if [[ ! -f "$file" ]]; then
    echo "skip (missing): $path" >&2
    continue
  fi
  case "$path" in
    */hero/hero-main-mobile.jpg|*/process/studio-mobile.jpg) optimize "$file" 800 ;;
    */hero/*|*/process/studio.jpg) optimize "$file" 1920 ;;
    *) optimize "$file" 1200 ;;
  esac
done < "$PATHS_FILE"

echo "Done."
