#!/usr/bin/env bash
# POSIX installer for Codex config snippet
# Usage: sh scripts/install-codex-config.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SNIPPET="$REPO_ROOT/.ai/CODEX_CONFIG_SNIPPET.toml"
CODEX_DIR="$HOME/.codex"
DEST="$CODEX_DIR/config.toml"

if [ ! -f "$SNIPPET" ]; then
  echo "Snippet not found at $SNIPPET" >&2
  exit 1
fi

mkdir -p "$CODEX_DIR"
cp -f "$SNIPPET" "$DEST"
echo "Copied snippet to $DEST"

echo "---- Begin $DEST content (first 40 lines) ----"
head -n 40 "$DEST" || true
echo "---- End preview ----"
