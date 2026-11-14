#!/bin/sh
set -eu
test "$PGDATABASE" = edusense_test
export PGPASSWORD="$(cat /fixture/secrets/db-owner)"
# A separate database in the disposable test PostgreSQL service.
createdb edusense_restore_test
age -d -i /fixture/backup-identity.txt -o /tmp/restore.dump /fixture/restore.dump.age
pg_restore --no-owner --no-acl --exit-on-error --dbname=edusense_restore_test /tmp/restore.dump
test "$(psql -AXqt -d edusense_restore_test -c 'SELECT count(*) FROM telemetry_readings WHERE value = 21.5')" = 1
