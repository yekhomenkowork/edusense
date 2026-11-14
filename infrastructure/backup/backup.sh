#!/bin/sh
set -eu
umask 077

log() {
    printf '{"timestamp":"%s","service":"backup","event":"%s"}\n' "$(date -u +%FT%TZ)" "$1"
}

interval=${BACKUP_INTERVAL_SECONDS:-86400}
retention=${BACKUP_RETENTION_DAYS:-14}
case "$interval:$retention" in
    *[!0-9:]*|:*|*:) log invalid_schedule; exit 1 ;;
esac
[ "$interval" -ge 60 ] && [ "$interval" -le 604800 ] && [ "$retention" -ge 1 ] || exit 1

if [ "${1:-}" = health ]; then
    [ ! -e /tmp/backup-failed ] && [ -s /tmp/backup-ok ] || exit 1
    read -r last < /tmp/backup-ok
    [ "$(($(date +%s) - last))" -lt "$((interval + 300))" ]
    exit
fi

case "${BACKUP_AGE_RECIPIENT:-}" in age1*) ;; *) log invalid_backup_recipient; exit 1 ;; esac
case "${BACKUP_OFFHOST_URL:-}" in ''|https://*) ;; *) log invalid_destination; exit 1 ;; esac
if [ -s /run/secrets/backup-offhost-auth ]; then
    auth_file=/run/secrets/backup-offhost-auth
else
    auth_file=/dev/null
fi
password=$(cat /run/secrets/db-backup)
export PGPASSWORD="$password"
unset password

backup() (
    set -eu
    stage=$(mktemp -d /tmp/backup.XXXXXX)
    archive="edusense-$(date -u +%Y%m%dT%H%M%S)-${stage##*.}.dump.age"
    partial="/backups/.$archive.partial"
    trap 'rm -f -- "$stage/archive.dump" "$partial"; rmdir -- "$stage"' EXIT
    pg_dump --no-password --format=custom --file="$stage/archive.dump"
    pg_restore --file=/dev/null "$stage/archive.dump"
    age -r "$BACKUP_AGE_RECIPIENT" -o "$partial" "$stage/archive.dump"
    mv -- "$partial" "/backups/$archive"
    if [ -n "${BACKUP_OFFHOST_URL:-}" ]; then
        curl --fail --silent --retry 2 --max-time 120 --proto '=https' --header "@$auth_file" \
             --upload-file "/backups/$archive" "${BACKUP_OFFHOST_URL%/}/$archive" >/dev/null
    fi
    # Retention is applied after creating and validating a fresh recovery point.
    find /backups -maxdepth 1 -type f -name 'edusense-*.dump.age' -mtime "+$retention" -delete
)

if [ "${1:-}" = once ]; then
    backup
    exit
fi

while :; do
    set +e
    backup
    result=$?
    set -e
    if [ "$result" -eq 0 ]; then
        date +%s > /tmp/backup-ok
        rm -f /tmp/backup-failed
        log backup_succeeded
        sleep "$interval"
    else
        touch /tmp/backup-failed
        log backup_failed
        sleep 60
    fi
done
