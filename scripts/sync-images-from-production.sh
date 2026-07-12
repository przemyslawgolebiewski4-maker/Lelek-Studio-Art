#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://www.lelekstudio.com}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATHS_FILE="$ROOT/scripts/image-paths.txt"

mkdir -p "$ROOT/public/images"

while IFS= read -r path; do
  [[ -z "$path" || "$path" =~ ^# ]] && continue
  path="${path#/}"
  dest="$ROOT/public/$path"
  mkdir -p "$(dirname "$dest")"
  url="$BASE_URL/$path"
  echo "→ $path"
  if curl -fsSL "$url" -o "$dest.tmp"; then
    mv "$dest.tmp" "$dest"
  else
    rm -f "$dest.tmp"
    fallback="$ROOT/scripts/image-fallbacks/$path"
    if [[ -f "$fallback" ]]; then
      echo "  ↳ using fallback for $path"
      cp "$fallback" "$dest"
    else
      echo "  ✗ failed: $url (no fallback)" >&2
      exit 1
    fi
  fi
done < "$PATHS_FILE"

echo "Done. $(wc -l < "$PATHS_FILE" | tr -d ' ') images synced."
