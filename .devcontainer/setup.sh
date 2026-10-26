#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> 安装前端依赖"
npm install --no-audit --no-fund

echo "==> 安装后端依赖"
(cd server && npm install --no-audit --no-fund)

echo "==> 等待 MySQL 并导入演示数据"
node .devcontainer/init-db.cjs
