#!/bin/sh
set -eu
umask 077
cd /fixture
test ! -e .env
mkdir -p web mqtt worker secrets devices
openssl req -x509 -newkey rsa:2048 -nodes -days 2 -subj /CN=EduSense-Disposable-Test \
    -keyout ca.key -out ca.crt
touch index.txt
printf '1000\n' > serial
cat > ca.cnf <<'CONFIG'
[ca]
default_ca=local
[local]
database=index.txt
serial=serial
certificate=ca.crt
private_key=ca.key
default_md=sha256
default_crl_days=2
CONFIG
openssl ca -config ca.cnf -gencrl -out mqtt/clients.crl
cert() {
    path=$1 cn=$2 usage=$3 san=$4
    openssl req -new -newkey rsa:2048 -nodes -subj "/CN=$cn" -keyout "$path.key" -out "$path.csr"
    printf 'extendedKeyUsage=%s\n%s\n' "$usage" "$san" > "$path.ext"
    openssl x509 -req -days 2 -sha256 -in "$path.csr" -CA ca.crt -CAkey ca.key -CAcreateserial \
        -extfile "$path.ext" -out "$path.crt"
    rm "$path.csr" "$path.ext"
    chmod 644 "$path.crt" "$path.key"
}
cert web/server frontend serverAuth subjectAltName=DNS:frontend,DNS:localhost,IP:127.0.0.1
cert mqtt/server mosquitto serverAuth subjectAltName=DNS:mosquitto,DNS:localhost,IP:127.0.0.1
cert worker/worker edusense-worker clientAuth ""
for folder in mqtt worker; do cp ca.crt "$folder/ca.crt"; chmod 644 "$folder/ca.crt"; done
chmod 755 web mqtt worker
chmod 644 mqtt/clients.crl
for name in db-owner db-app db-backup admin-password; do openssl rand -hex 24 > "secrets/$name"; done
python -c 'import pyotp; print(pyotp.random_base32())' > secrets/admin-totp
touch secrets/backup-offhost-auth
chmod 644 secrets/*
age-keygen -o backup-identity.txt
recipient=$(age-keygen -y backup-identity.txt)
cat > .env <<EOF
DB_NAME=edusense_test
DB_OWNER_USER=edusense_owner
DB_APP_USER=edusense_app
DB_BACKUP_USER=edusense_backup
ADMIN_EMAIL=admin@example.invalid
SECRETS_DIR=./.local-test/secrets
WEB_PKI_DIR=./.local-test/web
MQTT_SERVER_PKI_DIR=./.local-test/mqtt
MQTT_WORKER_PKI_DIR=./.local-test/worker
HTTPS_BIND_ADDRESS=127.0.0.1
HTTPS_PORT=18443
MQTT_BIND_ADDRESS=127.0.0.1
MQTT_PORT=18883
BACKUP_AGE_RECIPIENT=$recipient
EOF
chmod 644 .env
