# EduSense

EduSense — Cloud + Edge IoT-платформа для українських шкіл. Сервер складається з React SPA, FastAPI, PostgreSQL, Mosquitto та окремого Worker.

Для серверної частини потрібні Git, Docker Engine або Docker Desktop і Docker Compose. Підготуйте `.env` за шаблоном `.env.example` та файли секретів і TLS за [інструкцією](docs/DEPLOYMENT.md). Потім запустіть:

```sh
docker compose up -d --build
```

Стан контейнерів видно в `docker compose ps`. Розробка й перевірки виконуються [у контейнерах](docs/TESTING.md). Відомі ризики та межі реалізації описані в [огляді безпеки](docs/SECURITY.md).
