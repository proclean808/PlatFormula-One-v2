#!/usr/bin/env bash
# AIOS-X startup script
# Usage: bash start.sh

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$REPO_DIR/aiosx/backend"
FRONTEND_DIR="$REPO_DIR/aiosx/frontend"
BACKEND_PORT=49999
FRONTEND_PORT=8080

echo "──────────────────────────────────"
echo " AIOS-X startup"
echo "──────────────────────────────────"

# 1. Backend
echo "[1/2] Starting backend on :$BACKEND_PORT ..."
node "$BACKEND_DIR/server.js" &
BACKEND_PID=$!
echo "  backend PID $BACKEND_PID"

# give it a moment to bind
sleep 1

# 2. Frontend via Python static server (no extra deps)
echo "[2/2] Serving frontend on :$FRONTEND_PORT ..."
python3 -m http.server $FRONTEND_PORT --directory "$FRONTEND_DIR" &
FRONTEND_PID=$!
echo "  frontend PID $FRONTEND_PID"

echo ""
echo "──────────────────────────────────"
echo " AIOS-X LIVE"
echo "  UI  → http://localhost:$FRONTEND_PORT"
echo "  API → http://localhost:$BACKEND_PORT/infer"
echo ""
echo "  Stop: kill $BACKEND_PID $FRONTEND_PID"
echo "  or:   Ctrl-C"
echo "──────────────────────────────────"

# keep script alive so Ctrl-C kills both children
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'AIOS-X stopped.'" EXIT
wait
