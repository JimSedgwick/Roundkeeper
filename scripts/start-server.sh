#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$APP_DIR/logs"
NODE_BIN="$(command -v node || true)"

if [ -z "$NODE_BIN" ] && [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
fi

if [ -z "$NODE_BIN" ]; then
  echo "Unable to find node" >&2
  exit 1
fi

mkdir -p "$LOG_DIR"
cd "$APP_DIR"
exec "$NODE_BIN" server.js
