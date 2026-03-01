import os
import psycopg2
from fastapi import Header
from fastapi.responses import FileResponse
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import paho.mqtt.publish as publish

app = FastAPI(title="EduSense API & Webhooks")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "edusense_db"),
    "user": os.getenv("DB_USER", "eduser"),
    "password": os.getenv("DB_PASSWORD", "eduser_pass"),
    "host": "db"
}

def get_db_conn():
    return psycopg2.connect(**DB_CONFIG)

class VerifyRequest(BaseModel):
    name: str
    user: str
    password: str

class MQTTAuth(BaseModel):
    username: str = None
    password: str = None
    clientid: str = None
    topic: str = None
    acc: int = None

# --- API НАЛАШТУВАННЯ ESP ---
@app.get("/api/schools")
async def get_schools_list():
    try:
        with get_db_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT name FROM schools ORDER BY name;")
                return [row[0] for row in cur.fetchall()]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify_school")
async def verify_school(req: VerifyRequest):
    try:
        with get_db_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT 1 FROM schools WHERE name=%s AND mqtt_user=%s AND mqtt_pass=%s",
                    (req.name, req.user, req.password)
                )
                if cur.fetchone(): return {"status": "ok"}
                raise HTTPException(status_code=401, detail="Невірний логін або пароль")
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/subscriptions")
async def get_subscriptions(school: str):
    """Повертає статуси підписок для конкретного закладу"""
    try:
        with get_db_conn() as conn:
            with conn.cursor() as cur:
                # Перевіряємо, чи існують вже колонки
                cur.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='schools' AND column_name='sub_monitoring'
                """)
                if not cur.fetchone():
                    # Якщо колонок ще немає, віддаємо дефолтні значення
                    return {"basic": True, "monitoring": False, "security": False, "announcements": False}

                cur.execute(
                    "SELECT sub_monitoring, sub_security, sub_announcements FROM schools WHERE name=%s", 
                    (school,)
                )
                row = cur.fetchone()
                if row:
                    return {
                        "basic": True, # Базова підписка завжди активна для зареєстрованих шкіл
                        "monitoring": bool(row[0]),
                        "security": bool(row[1]),
                        "announcements": bool(row[2])
                    }
                raise HTTPException(status_code=404, detail="Школу не знайдено")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- API ДЛЯ OTA ОНОВЛЕНЬ (OVER-THE-AIR) ---
@app.get("/api/ota")
async def ota_update(x_esp8266_version: str = Header(None)):
    """Віддає нову прошивку, якщо версія на сервері вища за версію на ESP"""
    latest_version = os.getenv("LATEST_FW_VERSION", "1.0.0")
    fw_path = "/app/firmware/update.bin"

    if not x_esp8266_version:
        return Response(status_code=400, content="Відсутній заголовок версії")

    # Якщо версії співпадають — віддаємо код 304 (Not Modified)
    if x_esp8266_version == latest_version:
        return Response(status_code=304)

    # Якщо версія старіша і файл існує — віддаємо файл
    if os.path.exists(fw_path):
        return FileResponse(fw_path, media_type="application/octet-stream")
    
    return Response(status_code=404, content="Файл прошивки не знайдено")

# --- МОДЕЛЬ ДЛЯ КОМАНД ---
class OTACommand(BaseModel):
    school_name: str
    device_id: str = None  # Якщо вказати, оновиться 1 пристрій. Якщо ні - вся школа

# --- API ДЛЯ КЕРУВАННЯ ПРИСТРОЯМИ З СЕРВЕРА ---
@app.post("/api/admin/trigger_ota")
async def trigger_ota(cmd: OTACommand):
    """Відправляє команду на оновлення через MQTT брокер"""
    # Формуємо топік. Або для всієї школи, або для конкретного пристрою
    if cmd.device_id:
        topic = f"edusense/{cmd.school_name}/{cmd.device_id}/cmd"
    else:
        topic = f"edusense/{cmd.school_name}/cmd"
        
    auth = {'username': os.getenv("MQTT_USER"), 'password': os.getenv("MQTT_PASSWORD")}
    
    try:
        # Відправляємо одноразове повідомлення в Mosquitto
        publish.single(topic, payload="UPDATE_FW", hostname="mosquitto", port=1883, auth=auth)
        return {"status": "ok", "message": f"Команду відправлено в топік: {topic}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Помилка MQTT: {str(e)}")

# --- API ДЛЯ MOSQUITTO (WEBHOOKS) ---
@app.post("/api/mqtt/auth")
async def mqtt_auth(req: MQTTAuth):
    if req.username == os.getenv("MQTT_USER") and req.password == os.getenv("MQTT_PASSWORD"):
        return Response(status_code=200)
    try:
        with get_db_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM schools WHERE mqtt_user=%s AND mqtt_pass=%s", (req.username, req.password))
                if cur.fetchone(): return Response(status_code=200)
    except Exception:
        pass
    return Response(status_code=401)

@app.post("/api/mqtt/superuser")
async def mqtt_superuser(req: MQTTAuth):
    if req.username == os.getenv("MQTT_USER"): return Response(status_code=200)
    return Response(status_code=401)

@app.post("/api/mqtt/acl")
async def mqtt_acl(req: MQTTAuth):
    if req.username == os.getenv("MQTT_USER"): return Response(status_code=200)
    if req.topic and req.topic.startswith("edusense/"): return Response(status_code=200)
    return Response(status_code=401)
