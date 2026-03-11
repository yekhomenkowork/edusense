import sys
import os

# Додаємо шлях до папки app, щоб імпорти працювали правильно
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from passlib.context import CryptContext
    from database import SessionLocal
    from models.models import User
    print("✅ Імпорти завантажені успішно")
except ImportError as e:
    print(f"❌ Помилка імпорту: {e}")
    sys.exit(1)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test():
    db = SessionLocal()
    email = "school@admin.com"
    password = "123456"
    
    print(f"🔍 Тест логіну для: {email}")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        print("❌ Користувача не знайдено в базі!")
        return
    
    if pwd_context.verify(password, user.hashed_password):
        print(f"✅ Успіх! Користувач '{user.name}' (Role: {user.role}) авторизований.")
    else:
        print("❌ Невірний пароль!")
    db.close()

if __name__ == "__main__":
    test()
