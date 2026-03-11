from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os

from database import SessionLocal
from models.models import User

app = FastAPI(title="EduSense API", docs_url="/docs", openapi_url="/openapi.json")

# Налаштування CORS для безпечного спілкування з фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔐 Новий потужний згенерований ключ (64 символи, hex)
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"

# Чітка схема того, що ми чекаємо від фронтенду у тілі запиту
class LoginRequest(BaseModel):
    email: str
    password: str

# Залежність для роботи з базою
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/health")
def health():
    return {"status": "ok", "port": 8000}

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Шукаємо користувача
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Віддаємо 401 статус, який фронтенд перетворить у червону помилку
        raise HTTPException(status_code=401, detail="Користувача не знайдено")
    
    # 2. Перевіряємо пароль через bcrypt
    if not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Невірний пароль")
        
    # 3. Генеруємо JWT токен
    access_token = jwt.encode(
        {
            "sub": user.email, 
            "role": user.role, 
            "exp": datetime.utcnow() + timedelta(days=1)
        }, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    
    # 4. Віддаємо дані, які очікує Zustand-стор фронтенду
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
