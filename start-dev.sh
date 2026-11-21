#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
VENV_DIR="$SERVER_DIR/.venv"

if [[ ! -x "$VENV_DIR/bin/python" ]]; then
  echo "Backend virtual environment not found at $VENV_DIR"
  echo "Create it with: python3 -m venv server/.venv"
  echo "Then install dependencies with: server/.venv/bin/pip install -r server/requirements.txt"
  exit 1
fi

if [[ ! -f "$SERVER_DIR/.env" ]]; then
  echo "Missing server/.env. Copy server/.env.example to server/.env and configure PostgreSQL."
  exit 1
fi

if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
  echo "Frontend dependencies are missing. Run 'npm install' from the project root, then rerun this script."
  exit 1
fi

BACKEND_PID=""
FRONTEND_PID=""
cleanup() {
  trap - INT TERM EXIT
  [[ -z "$BACKEND_PID" ]] || kill "$BACKEND_PID" 2>/dev/null || true
  [[ -z "$FRONTEND_PID" ]] || kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "Applying database migrations..."
(cd "$SERVER_DIR" && "$VENV_DIR/bin/alembic" upgrade head)
echo "Seeding demo data (safe to rerun)..."
(cd "$SERVER_DIR" && "$VENV_DIR/bin/python" -m app.seed)

echo "Starting API at http://localhost:8000 and frontend at http://localhost:5173"
(cd "$SERVER_DIR" && "$VENV_DIR/bin/uvicorn" app.main:app --reload) &
BACKEND_PID=$!
(cd "$ROOT_DIR" && npm run dev) &
FRONTEND_PID=$!

# Poll both processes for compatibility with the Bash 3.2 shipped on macOS.
while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done
