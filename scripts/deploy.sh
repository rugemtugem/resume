#!/usr/bin/env bash
# Server-side deploy: rebuild the image and restart the container.
# Run from the repo root on the VPS (the CI workflow does: git reset --hard
# origin/main && bash scripts/deploy.sh). Safe to run by hand too.
#
# Adjust PORT below (or export it before calling) if the container is not
# published on 3000, or replace this with your docker-compose invocation.
set -euo pipefail

IMAGE="rugemtugem-dev:latest"
CONTAINER="rugemtugem-dev"
PORT="${PORT:-3000}"

if [ ! -f .env ]; then
  echo "WARNING: .env not found in $(pwd) — the container will start without SMTP secrets." >&2
fi

echo "==> Building image $IMAGE"
docker build -t "$IMAGE" .

echo "==> Restarting container $CONTAINER on port $PORT"
docker rm -f "$CONTAINER" 2>/dev/null || true
docker run -d --name "$CONTAINER" --restart unless-stopped \
  -p "${PORT}:3000" \
  $( [ -f .env ] && echo "--env-file .env" ) \
  "$IMAGE"

echo "==> Pruning dangling images"
docker image prune -f >/dev/null || true

echo "==> Done:"
docker ps --filter "name=$CONTAINER" --format '{{.Status}} | {{.Ports}}'
