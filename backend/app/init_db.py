from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, School, Device, AudioZone, SecurityScenario
import os
from passlib.context import CryptContext

# ПРІОРИТЕТ: Змінні з .env -> якщо немає, то ваші реальні дані
DB_USER = os.getenv("DB_USER", "eduser")
DB_PASS = os.getenv("DB_PASSWORD", "pG4xi7zlAibH1lhS6b")
DB_NAME = os.getenv("DB_NAME", "edusense_db")
DB_HOST = os.getenv("DB_HOST", "db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

print(f"DEBUG: Trying to connect to {DB_HOST} as {DB_USER}...")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    # Створюємо таблиці, якщо їх немає
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        hashed_pw = pwd_context.hash("123456")
        
        # Перевіряємо чи є школа (Центральна Гімназія з вашого SQL)
        school = db.query(School).filter(School.name == "Центральна Гімназія").first()
        if not school:
            school = School(name="Центральна Гімназія", address="вул. Незалежності, 1", subscription_tier="pro")
            db.add(school)
            db.commit()
            db.refresh(school)

        # Додаємо адмінів, якщо їх немає
        if not db.query(User).filter(User.email == "school@admin.com").first():
            db.add_all([
                User(email="sys@admin.com", hashed_password=hashed_pw, name="Глобальний Адмін", role="system_admin"),
                User(email="school@admin.com", hashed_password=hashed_pw, name="Директор Гімназії", role="school_admin", school_id=school.id),
                User(email="staff@school.com", hashed_password=hashed_pw, name="Охорона", role="security", school_id=school.id)
            ])
            print("✅ Користувачів додано.")

        db.commit()
        print("🚀 Синхронізація з БД завершена успішно!")
    except Exception as e:
        print(f"❌ Помилка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
