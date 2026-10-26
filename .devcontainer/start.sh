#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node .devcontainer/init-db.cjs

if ! curl -sf http://localhost:3000/api/stats/public >/dev/null 2>&1; then
  echo "==> 启动后端 (3000)"
  (cd server && nohup node app.js >/tmp/apartment-backend.log 2>&1 &)
fi

if ! curl -sf http://localhost:5175/ >/dev/null 2>&1; then
  echo "==> 启动前端 (5175)"
  nohup npm run dev >/tmp/apartment-frontend.log 2>&1 &
fi

if [ -n "${CODESPACE_NAME:-}" ]; then
  echo "公开网址：https://${CODESPACE_NAME}-5175.app.github.dev"
else
  echo "前端地址：http://localhost:5175"
fi
