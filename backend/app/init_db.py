import os
from app.database import engine, Base, SessionLocal
from app.models.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    print("⏳ Створення таблиць бази даних...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "superadmin@edusense.com")
    admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "AdminPass2026!")
    admin_name = os.getenv("DEFAULT_ADMIN_NAME", "System Administrator")

    # Перевіряємо, чи існує адмін
    if not db.query(User).filter(User.email == admin_email).first():
        print(f"🛠 Створення головного адміністратора: {admin_email}")
        hashed_pw = pwd_context.hash(admin_password)
        admin = User(
            email=admin_email,
            hashed_password=hashed_pw,
            name=admin_name,
            role="sysadmin"
        )
        db.add(admin)
        db.commit()
        print("✅ СуперАдмін успішно створений!")
    else:
        print("ℹ️ СуперАдмін вже існує в базі.")
        
    db.close()

if __name__ == "__main__":
    init_db()
