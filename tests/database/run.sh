#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
container=guvenkent-phase11-db
image='postgres:17-alpine@sha256:eee6c6e1b0894fa4fe0075eb054af9fd1cf39a35321c2d4110626cfe506411fb'
if docker inspect "$container" >/dev/null 2>&1; then
  label=$(docker inspect --format '{{index .Config.Labels "guvenkent.test-db"}}' "$container")
  if [[ "$label" != phase11 ]]; then
    echo 'Refusing an unrecognized database container; do not use production data.' >&2
    exit 1
  fi
  docker start "$container" >/dev/null
else
  # No published port; synthetic test DB only. Never a production auth setting.
  docker run --name "$container" --label guvenkent.test-db=phase11 -e POSTGRES_HOST_AUTH_METHOD=trust -d "$image" >/dev/null
fi
for attempt in $(seq 1 30); do
  if docker exec "$container" pg_isready -U postgres >/dev/null; then break; fi
  if [[ "$attempt" == 30 ]]; then exit 1; fi
  sleep 1
done
docker exec -i "$container" psql -U postgres -v ON_ERROR_STOP=1 < tests/database/bootstrap.sql
for migration in supabase/migrations/*.sql; do
  docker exec -i "$container" psql -U postgres -v ON_ERROR_STOP=1 < "$migration"
done
python tests/database/security.py
