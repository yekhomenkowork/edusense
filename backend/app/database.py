import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Читаємо URL бази з .env (який ми створили раніше)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://edusense_admin:SuperSecretDBPassword123@db:5432/edusense_prod"
)

# Створюємо двигун підключення
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Створюємо фабрику сесій
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовий клас для наших моделей (саме його і не міг знайти Python!)
Base = declarative_base()
