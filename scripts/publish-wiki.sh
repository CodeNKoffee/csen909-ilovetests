#!/usr/bin/env bash
# Publishes docs/wiki/*.md to the GitHub wiki. Overwrites pages edited on the website.
# First time only: open https://github.com/CodeNKoffee/csen909-ilovetests/wiki, create any first page and save it.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHA="$(git -C "$ROOT" rev-parse --short HEAD)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
git clone --quiet "https://github.com/CodeNKoffee/csen909-ilovetests.wiki.git" "$TMP/wiki"
find "$TMP/wiki" -maxdepth 1 -name '*.md' -delete
cp "$ROOT"/docs/wiki/*.md "$TMP/wiki/"
cd "$TMP/wiki"
git add -A
if git diff --cached --quiet; then echo "Wiki already up to date."; exit 0; fi
git commit --quiet -m "Sync wiki from docs/wiki at $SHA"
git push --quiet
echo "Wiki published from $SHA."
