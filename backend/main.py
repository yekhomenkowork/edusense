# backend/main.py
import os
import psycopg2
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
