from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import schools, ota, mqtt
from app.db.database import Base, engine

# Автоматично створюємо таблиці в БД при запуску, якщо їх ще немає
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduSense Cloud API", version="2.0")

app.add_middleware(
            CORSMiddleware,
                allow_origins=["*"],
                    allow_methods=["*"],
                        allow_headers=["*"],
                        )

# Підключаємо наші модульні роути
app.include_router(schools.router, prefix="/api", tags=["Schools"])
app.include_router(ota.router, prefix="/api", tags=["OTA Updates"])
app.include_router(mqtt.router, prefix="/api/mqtt", tags=["MQTT Webhooks"])

