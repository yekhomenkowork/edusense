#!/bin/sh
set -eu
test "$PGDATABASE" = edusense_test
export PGPASSWORD="$(cat /fixture/secrets/db-owner)"
if [ "${1:-}" = verify ]; then
    test "$(psql -AXqt -d edusense_legacy_test -c 'SELECT role FROM school_memberships WHERE school_id = 1 AND user_id = 1')" = school_admin
    test "$(psql -AXqt -d edusense_legacy_test -c 'SELECT value FROM old_telemetry WHERE id = 1')" = 19
    exit
fi
createdb edusense_legacy_test
psql -v ON_ERROR_STOP=1 -d edusense_legacy_test <<'SQL'
CREATE TABLE schools (id serial PRIMARY KEY, name varchar(255) NOT NULL, mqtt_user varchar(100) NOT NULL, mqtt_pass varchar(255) NOT NULL);
CREATE TABLE users (id serial PRIMARY KEY, email varchar(255) UNIQUE NOT NULL, name varchar(255), hashed_password varchar(255) NOT NULL, role varchar(50), school_id integer REFERENCES schools);
CREATE TABLE old_telemetry (id integer PRIMARY KEY, value integer NOT NULL);
INSERT INTO schools (name,mqtt_user,mqtt_pass) VALUES ('Legacy','previous_identity','synthetic_fixture_only');
INSERT INTO users (email,name,hashed_password,role,school_id) VALUES ('legacy@example.invalid','Legacy','unused_fixture','school_admin',1);
INSERT INTO old_telemetry VALUES (1,19);
SQL
