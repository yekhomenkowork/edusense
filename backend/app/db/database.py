from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Створюємо двигун для підключення
engine = create_engine(settings.DATABASE_URL)

# Створюємо фабрику сесій
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовий клас для наших моделей таблиць
Base = declarative_base()

# Залежність (Dependency) для FastAPI, щоб кожний запит мав свою сесію
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
