#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"
HOST="${HOST:-127.0.0.1}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR"

echo "Starting Draft It at http://${HOST}:${PORT}"
echo "Press Ctrl+C to stop."

python3 -m http.server "$PORT" --bind "$HOST"
