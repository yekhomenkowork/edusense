from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from typing import List, Optional

from app.database import SessionLocal
from app.models.models import User, School

app = FastAPI(title="EduSense API", docs_url="/docs", openapi_url="/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"

# ==========================================
# СХЕМИ ДАНИХ (Pydantic Models)
# ==========================================
class LoginRequest(BaseModel):
    email: str
    password: str

class SchoolBase(BaseModel):
    name: str
    region: str
    city: str
    plan: str = "Trial"
    status: str = "Налаштування"

class SchoolCreate(SchoolBase):
    pass

class SchoolResponse(SchoolBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# ==========================================
# ЗАЛЕЖНОСТІ (Dependencies)
# ==========================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# ЕНДПОІНТИ (API Routes)
# ==========================================
@app.get("/api/health")
def health():
    return {"status": "ok", "port": 8000}

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Користувача не знайдено")
    
    if not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Невірний пароль")
        
    access_token = jwt.encode(
        {"sub": user.email, "role": user.role, "exp": datetime.utcnow() + timedelta(days=1)}, 
        SECRET_KEY, algorithm=ALGORITHM
    )
    
    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "school_id": user.school_id
        }
    }

# --- НОВІ ЕНДПОІНТИ ДЛЯ ШКІЛ ---

@app.get("/api/schools", response_model=List[SchoolResponse])
def get_schools(db: Session = Depends(get_db)):
    """Отримати список усіх шкіл"""
    return db.query(School).all()

@app.post("/api/schools", response_model=SchoolResponse)
def create_school(school: SchoolCreate, db: Session = Depends(get_db)):
    """Створити новий навчальний заклад"""
    db_school = School(
        name=school.name,
        region=school.region,
        city=school.city,
        plan=school.plan,
        status=school.status
    )
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school

@app.get("/api/schools/{school_id}", response_model=SchoolResponse)
def get_school(school_id: int, db: Session = Depends(get_db)):
    """Отримати деталі однієї школи"""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="Школу не знайдено")
    return school

@app.delete("/api/schools/{school_id}")
def delete_school(school_id: int, db: Session = Depends(get_db)):
    """Видалити школу"""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="Школу не знайдено")
    db.delete(school)
    db.commit()
    return {"message": "Школу успішно видалено"}

# --- СХЕМИ ДЛЯ КОРИСТУВАЧІВ ТА ОНОВЛЕННЯ ШКОЛИ ---
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    
    model_config = ConfigDict(from_attributes=True)

class SchoolUpdate(BaseModel):
    plan: Optional[str] = None
    status: Optional[str] = None
    mqtt_password: Optional[str] = None

# --- ЕНДПОІНТИ ДЛЯ КОРИСТУВАЧІВ ТА НАЛАШТУВАНЬ ---
@app.get("/api/schools/{school_id}/users", response_model=List[UserResponse])
def get_school_users(school_id: int, db: Session = Depends(get_db)):
    """Отримати всіх користувачів конкретної школи"""
    return db.query(User).filter(User.school_id == school_id).all()

@app.post("/api/schools/{school_id}/users", response_model=UserResponse)
def create_school_user(school_id: int, user: UserCreate, db: Session = Depends(get_db)):
    """Створити нового користувача для школи"""
    # Перевіряємо чи не зайнятий email
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Користувач з таким email вже існує")
        
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pw,
        role=user.role,
        school_id=school_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Видалити користувача"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")
    db.delete(user)
    db.commit()
    return {"message": "Видалено"}

@app.patch("/api/schools/{school_id}", response_model=SchoolResponse)
def update_school(school_id: int, school_update: SchoolUpdate, db: Session = Depends(get_db)):
    """Оновити налаштування школи (MQTT, Підписка)"""
    db_school = db.query(School).filter(School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="Школу не знайдено")
    
    if school_update.plan is not None: db_school.plan = school_update.plan
    if school_update.status is not None: db_school.status = school_update.status
    if school_update.mqtt_password is not None: db_school.mqtt_password = school_update.mqtt_password
    
    db.commit()
    db.refresh(db_school)
    return db_school
