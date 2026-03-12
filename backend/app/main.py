import os
import docker
import psutil
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from passlib.context import CryptContext
from jose import jwt

# Імпорти для БД
from app.database import SessionLocal, engine
from app.models.models import Base, User, School

app = FastAPI(title="EduSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"

# ==========================================
# АВТОМАТИЧНА ІНІЦІАЛІЗАЦІЯ ПРИ СТАРТІ
# ==========================================
@app.on_event("startup")
def startup_event():
    print("⏳ Перевірка та ініціалізація бази даних...", flush=True)
    # 1. Створюємо таблиці, якщо їх немає
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 2. Читаємо дані адміна з .env
        admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "superadmin@edusense.com")
        admin_pass = os.getenv("DEFAULT_ADMIN_PASSWORD", "AdminPass2026!")
        admin_name = os.getenv("DEFAULT_ADMIN_NAME", "System Administrator")
        
        # 3. Перевіряємо, чи існує такий користувач
        admin_exists = db.query(User).filter(User.email == admin_email).first()
        if not admin_exists:
            print(f"🔧 Створення системного адміністратора: {admin_email}", flush=True)
            hashed_pw = pwd_context.hash(admin_pass)
            new_admin = User(name=admin_name, email=admin_email, hashed_password=hashed_pw, role="sysadmin")
            db.add(new_admin)
            db.commit()
            print("✅ СуперАдмін успішно створений автоматично!", flush=True)
        else:
            print("✅ СуперАдмін вже існує. База готова до роботи.", flush=True)
    except Exception as e:
        print(f"❌ Помилка ініціалізації БД: {e}", flush=True)
    finally:
        db.close()

# --- СХЕМИ ---
class LoginRequest(BaseModel):
    email: str
    password: str

class SchoolBase(BaseModel):
    name: str
    region: str
    city: str
    plan: str = "Trial"
    status: str = "Налаштування"
    mqtt_password: Optional[str] = None

class SchoolResponse(SchoolBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- СИСТЕМНА ЛОГІКА (DOCKER & METRICS) ---
def get_docker_client():
    try:
        return docker.from_env()
    except Exception as e:
        print(f"Docker Connect Error: {e}")
        return None

def get_real_uptime():
    try:
        with open('/proc/uptime', 'r') as f:
            seconds = float(f.readline().split()[0])
        h, m = int(seconds // 3600), int((seconds % 3600) // 60)
        return f"{h}h {m}m"
    except: return "Unknown"

@app.get("/api/system/metrics")
def get_metrics():
    mem = psutil.virtual_memory()
    return {
        "cpu": psutil.cpu_percent(interval=0.1),
        "ram_used": round(mem.used / (1024**3), 2),
        "ram_total": round(mem.total / (1024**3), 2),
        "ram_percent": mem.percent,
        "uptime": get_real_uptime(),
        "db_status": "Connected"
    }

@app.get("/api/system/containers")
def get_containers():
    client = get_docker_client()
    if not client: return {"error": "Docker Socket inaccessible"}
    return [{
        "id": c.short_id,
        "name": c.name,
        "status": c.status,
        "image": c.image.tags[0] if c.image.tags else "unknown"
    } for c in client.containers.list(all=True)]

@app.get("/api/system/containers/{name}/logs")
def get_logs(name: str):
    client = get_docker_client()
    try:
        container = client.containers.get(name)
        logs = container.logs(tail=50).decode('utf-8', errors='replace').split('\n')
        return {"logs": [l for l in logs if l.strip()]}
    except: raise HTTPException(status_code=404)

# --- AUTH & SCHOOLS ---
@app.post("/api/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Невірні дані")
    token = jwt.encode({"sub": user.email, "role": user.role, "exp": datetime.utcnow() + timedelta(days=1)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "user": {"id": user.id, "name": user.name, "role": user.role}}

@app.get("/api/schools", response_model=List[SchoolResponse])
def list_schools(db: Session = Depends(get_db)):
    return db.query(School).all()

@app.post("/api/schools", response_model=SchoolResponse)
def create_school(school: SchoolBase, db: Session = Depends(get_db)):
    db_school = School(**school.model_dump())
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school

@app.get("/api/schools/{id}", response_model=SchoolResponse)
def get_school(id: int, db: Session = Depends(get_db)):
    s = db.query(School).filter(School.id == id).first()
    if not s: raise HTTPException(status_code=404)
    return s

@app.delete("/api/schools/{id}")
def delete_school(id: int, db: Session = Depends(get_db)):
    db.query(School).filter(School.id == id).delete()
    db.commit()
    return {"ok": True}

@app.get("/api/system/containers/{name}/stats")
def get_container_stats(name: str):
    """Отримує реальні CPU та RAM для конкретного контейнера"""
    client = get_docker_client()
    if not client:
        return {"cpu_percent": 0, "ram_mb": 0, "error": "No client"}
    try:
        container = client.containers.get(name)
        # stream=False повертає миттєвий зліпок статистики
        stats = container.stats(stream=False)
        
        # Вираховуємо CPU (%)
        cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats.get('precpu_stats', {}).get('cpu_usage', {}).get('total_usage', 0)
        system_delta = stats['cpu_stats'].get('system_cpu_usage', 0) - stats.get('precpu_stats', {}).get('system_cpu_usage', 0)
        cpu_percent = 0.0
        if system_delta > 0 and cpu_delta > 0:
            cpus = stats['cpu_stats'].get('online_cpus', 1)
            cpu_percent = (cpu_delta / system_delta) * cpus * 100.0
            
        # Вираховуємо RAM (MB)
        ram_usage = stats['memory_stats'].get('usage', 0)
        # Віднімаємо кеш, щоб бачити реальне споживання пам'яті (як у htop)
        cache = stats['memory_stats'].get('stats', {}).get('cache', 0)
        real_ram = ram_usage - cache if ram_usage > cache else ram_usage
        ram_mb = real_ram / (1024 * 1024)
        
        return {
            "cpu_percent": round(cpu_percent, 2),
            "ram_mb": round(ram_mb, 1)
        }
    except Exception as e:
        return {"cpu_percent": 0, "ram_mb": 0, "error": str(e)}

@app.get("/api/system/logs/aggregated")
def get_aggregated_logs(period: str = "24h"):
    """Сканує логи всіх контейнерів на наявність помилок та попереджень за період"""
    client = get_docker_client()
    if not client:
        return {"error": "Docker Socket inaccessible"}
    
    # Розрахунок часу (since)
    since_time = None
    now = datetime.utcnow()
    if period == "1h": since_time = now - timedelta(hours=1)
    elif period == "24h": since_time = now - timedelta(hours=24)
    elif period == "7d": since_time = now - timedelta(days=7)
    elif period == "30d": since_time = now - timedelta(days=30)

    aggregated_events = []
    stats = {"errors": 0, "warnings": 0}

    try:
        for c in client.containers.list(all=True):
            # Беремо логи тільки за потрібний час
            logs_bytes = c.logs(since=since_time, timestamps=True, tail=2000)
            logs_str = logs_bytes.decode('utf-8', errors='replace').split('\n')
            
            for line in logs_str:
                if not line.strip(): continue
                
                # Примітивний парсер рівня логування
                level = "INFO"
                is_error = "error" in line.lower() or "exception" in line.lower() or "traceback" in line.lower()
                is_warn = "warn" in line.lower()

                if is_error:
                    level = "ERROR"
                    stats["errors"] += 1
                elif is_warn:
                    level = "WARN"
                    stats["warnings"] += 1
                
                # Додаємо у список тільки помилки та попередження для економії трафіку
                if is_error or is_warn:
                    # Розділяємо таймстемп Docker (перше слово) і саме повідомлення
                    parts = line.split(" ", 1)
                    timestamp = parts[0][:19].replace("T", " ") if len(parts) > 0 else ""
                    msg = parts[1] if len(parts) > 1 else line
                    
                    aggregated_events.append({
                        "container": c.name,
                        "timestamp": timestamp,
                        "level": level,
                        "message": msg[:200] + "..." if len(msg) > 200 else msg
                    })
        
        # Сортуємо від найновіших до найстаріших
        aggregated_events.sort(key=lambda x: x["timestamp"], reverse=True)
        return {"stats": stats, "events": aggregated_events[:100]} # Віддаємо топ-100
    except Exception as e:
        return {"error": str(e)}
