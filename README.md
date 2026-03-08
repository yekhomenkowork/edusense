# EduSense Cloud Platform

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![MQTT](https://img.shields.io/badge/Mosquitto-MQTT-660066?style=flat-square&logo=eclipse-mosquitto)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![C++](https://img.shields.io/badge/Firmware-C%2B%2B-00599C?style=flat-square&logo=c%2B%2B)

> **Development Status: Pre-Alpha (Path to MVP)**
> Ця версія репозиторію перебуває на стадії активної розробки. Поточна мета — стабілізація мікросервісної архітектури та інтеграція розрізнених модулів (Backend, Frontend, Edge Devices) до стану першого повноцінно працюючого прототипу (Minimum Viable Product). Архітектурні рішення та контракти API можуть змінюватися.

## Про проєкт

**EduSense** — це незалежна авторська апаратно-програмна екосистема для управління інфраструктурою навчальних закладів. Платформа є результатом власної ідеї та повної самостійної реалізації, що змінює традиційний підхід до безпеки, комунікації та моніторингу простору. 

Проєкт створюється з фокусом на високу відмовостійкість, енергонезалежність кінцевих вузлів та мінімальну затримку передачі даних (Low Latency).

### Ключові можливості
* **Smart Audio-Hub:** Заміна механічних дзвінків на цифрову аудіосистему з підтримкою фонової музики, голосових оголошень та Live-подкастів.
* **Динамічна евакуація:** Автоматизоване дублювання сигналів тривоги та увімкнення світлової навігації до безпечних зон.
* **Тотальний моніторинг:** Контроль відкриття/закриття дверей, фіксація руху в закритих приміщеннях та виявлення задимлення.
* **Прецизійний мікроклімат:** Збір та аналітика показників температури, вологості та рівня CO2 для підтримання оптимальних умов.

## Системна архітектура

Система побудована за принципами мікросервісної архітектури (Layered Architecture) та використовує гібридну модель зв'язку:

1. **REST API Layer (FastAPI):** Синхронний інтерфейс для управління конфігураціями, реєстрації пристроїв, авторизації (JWT) та дистрибуції прошивок (OTA). Взаємодіє з PostgreSQL через SQLAlchemy ORM.
2. **Data Processing Layer (Standalone Worker):** Ізольований фоновий процес (Python), що асинхронно прослуховує топіки брокера повідомлень, фільтрує телеметрію та виконує транзакційні записи в БД.
3. **Messaging Broker (Eclipse Mosquitto):** Забезпечує високошвидкісний двосторонній зв'язок (Publish/Subscribe) між сервером та кінцевими пристроями по протоколу MQTT.
4. **Edge Devices (ESP8266/ESP32):** Автономні апаратні модулі, написані на C++. Відповідають за збір сенсорних даних та виконання локальних алгоритмів реагування.

## Структура Monorepo

Репозиторій організовано за галузевим стандартом Monorepo, що об'єднує інфраструктурну, програмну та апаратну складові, і повністю підготовлений до впровадження CI/CD:

```text
edusense/
├── backend/                # Серверна частина
│   ├── app/                # Ядро API: Моделі (SQLAlchemy), Схеми (Pydantic), Роути
│   ├── worker/             # Обробник MQTT-повідомлень
│   ├── requirements.txt    # Залежності Python
│   └── Dockerfile          # Специфікація контейнера
├── frontend/               # Клієнтська частина (UI/UX)
│   ├── index.html          # Головна точка входу (Web Dashboard Mockup)
│   └── css/                # Стилі (Glassmorphism UI)
├── edge_devices/           # Апаратна частина (IoT)
│   ├── src/                # Вихідний код мікроконтролерів (C/C++)
│   └── builds/             # Бінарні файли для OTA-оновлень (.bin)
├── infrastructure/         # Сервісні конфігурації
│   ├── nginx/              # Конфігурації Reverse Proxy
│   ├── mosquitto/          # Конфігурації брокера повідомлень та ACL
│   └── postgres_init/      # Скрипти ініціалізації БД
└── docker-compose.yml      # Головний оркестратор екосистеми
```

Розгортання (Development Environment)
Для розгортання локальної версії платформи необхідні Docker та Docker Compose.

Клонування репозиторію:

Bash
git clone [https://github.com/yekhomenkowork/edusense.git](https://github.com/yekhomenkowork/edusense.git)
cd edusense
Налаштування оточення:
Створіть файл змінних оточення з наданого шаблону.

Bash
cp example.env .env
Увага: Відредагуйте .env файл, вказавши надійні паролі для PostgreSQL та MQTT брокера перед запуском.

Запуск екосистеми:
Ініціалізація та збірка всіх контейнерів у фоновому режимі:

Bash
docker compose up -d --build
Доступ до сервісів:

Web Interface: http://localhost:80 (через Nginx)

API Swagger UI: http://localhost:5000/docs

MQTT Broker: localhost:1883

Авторство та Ліцензія
Цей проєкт є повністю незалежною авторською розробкою. Уся концепція продукту, архітектурні рішення, програмний код бекенду, дизайн інтерфейсів та апаратна імплементація створені з нуля як власна ініціатива автора.

Copyright (c) 2026 EduSense Cloud Platform.
