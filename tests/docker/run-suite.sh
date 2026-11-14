#!/bin/sh
set -eu
project=${1:?Supply a new project name starting with edusense-test-}
case "$project" in edusense-test-?*) ;; *) exit 2 ;; esac
test -z "$(docker ps -aq --filter "label=com.docker.compose.project=$project")"
test -z "$(docker volume ls -q --filter "label=com.docker.compose.project=$project")"
dc() {
    docker compose -p "$project" --env-file .local-test/.env -f docker-compose.yml -f compose.test.yml --profile test "$@"
}
trap 'dc down --remove-orphans' EXIT
dc config --quiet
dc run --build --rm --no-deps backend_test
dc run --rm --no-deps backend_test ruff check app worker alembic tests
dc run --rm --no-deps backend_test bandit -r app worker -ll -ii
dc run --build --rm --no-deps frontend_test
dc run --rm --no-deps frontend_test ./node_modules/.bin/eslint src/store/loginPayload.js src/store/loginPayload.test.js
dc up -d --build --wait --wait-timeout 180 db migrate mosquitto backend mqtt_worker frontend backup
dc run --build --rm --no-deps integration sh /tests/legacy.sh
dc run --rm --no-deps -e DB_NAME=edusense_legacy_test migrate
dc run --rm --no-deps integration sh /tests/legacy.sh verify
dc run --rm --no-deps migrate
dc run --rm --no-deps integration
dc up -d --force-recreate --wait --wait-timeout 180 db backend mqtt_worker frontend
dc run --rm --no-deps integration python /tests/integration.py persistence
dc exec -T backup /opt/backup/backup.sh once
dc exec -T backup sh -ec 'archive=$(ls -t /backups/edusense-*.dump.age | head -n 1); test -n "$archive"; cat "$archive"' > .local-test/restore.dump.age
dc run --rm --no-deps integration sh /tests/restore.sh
