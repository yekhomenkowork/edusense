# Контейнерні перевірки

Запускайте лише в погодженому disposable Docker-середовищі зі свіжим проєктом `edusense-test-<мітка>`, окремими томами й синтетичними секретами. Приклади нижче виконуються з кореня репозиторію у shell. У PowerShell для bind mount можна замінити `$PWD` на `${PWD}`. На Windows не встановлюйте рантайми застосунку для перевірок.

```sh
mkdir .local-test
docker build -t edusense-test-fixtures tests/docker
docker run --rm --network none --tmpfs /var/lib/postgresql/data -v "$PWD/.local-test:/fixture" edusense-test-fixtures prepare-edusense-tests
```

Команди нижче використовують одну мітку; для нового незалежного запуску виберіть свіжий checkout/каталог тестових матеріалів і нову мітку. Функція скорочує виклики Docker Compose.

```sh
dc() { docker compose -p edusense-test-local --env-file .local-test/.env -f docker-compose.yml -f compose.test.yml --profile test "$@"; }
dc config --quiet
dc run --build --rm --no-deps backend_test
dc run --build --rm --no-deps frontend_test
dc run --rm --no-deps backend_test ruff check app worker alembic tests
dc run --rm --no-deps frontend_test npm run lint
dc run --rm --no-deps backend_test bandit -r app worker -ll -ii
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
dc down --remove-orphans
```

Для двійкового експорту в PowerShell використовуйте версію 7.4+ або запускайте наведений сценарій через Git Bash.

Для сканування передайте інструменту лише відстежувані джерела. Сканування історії робіть у чистій тестовій копії репозиторію; Gitleaks виводить редаговані результати. Образи передаються сканеру як локальні tar-архіви.

```sh
mkdir .local-test/source .local-test/images
git archive --output=.local-test/source.tar HEAD
docker run --rm --network none --tmpfs /var/lib/postgresql/data -v "$PWD/.local-test:/fixture" edusense-test-fixtures tar -xf /fixture/source.tar -C /fixture/source
dc run --rm --no-deps scanner
docker run --rm --network none -e GIT_CONFIG_COUNT=1 -e GIT_CONFIG_KEY_0=safe.directory -e GIT_CONFIG_VALUE_0=/repo -v "$PWD/.git:/repo/.git:ro" ghcr.io/gitleaks/gitleaks:v8.24.3 git --redact /repo
docker save edusense-test-local-backend -o .local-test/images/backend.tar
dc run --rm --no-deps scanner image --input /images/backend.tar --scanners vuln,secret --severity HIGH,CRITICAL --exit-code 1
dc run --rm --no-deps scanner image --input /images/backend.tar --format cyclonedx
```

У CI також перевіряються залежності через pip-audit та npm audit і генеруються SBOM для серверних образів. Помилки збірки, lint, міграцій і сканування слід аналізувати за фактичним виводом. Контрольний прогін перевіряє незалежні школи, ролі, відкликання доступу, TOTP, авторизовану MQTT-телеметрію, заборонену міжшкільну публікацію, збереження після перестворення, стару схему та розшифрований бекап. Це тести серверної основи; апаратні й офлайн-сценарії Gateway окремі.

## Фактичні результати цього завдання

Docker CLI не знайдено в доступному середовищі. **NOT RUN** — валідація Compose, збірка, backend/frontend-тести, lint, перевірка HTTPS, міграції, MQTT, ACL, Worker, перестворення контейнерів, відновлення, сканування коду, залежностей, образів, секретів та історії. Прохід цих критеріїв має підтвердити ізольований прогін. Перевірено тільки стан і diff Git. Рантайми й інструменти проєкту на Windows не запускалися.
