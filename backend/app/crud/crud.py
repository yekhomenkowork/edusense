from sqlalchemy.orm import Session
from app.models.models import School
from app.schemas.schemas import VerifyRequest

# Отримати список всіх шкіл
def get_all_schools(db: Session):
    return db.query(School.name).order_by(School.name).all()

# Перевірка логіну/паролю школи
def verify_school(db: Session, req: VerifyRequest):
    return db.query(School).filter(
        School.name == req.name,
        School.mqtt_user == req.user,
        School.mqtt_pass == req.password
    ).first()

# Отримати школу за назвою (для підписок)
def get_school_by_name(db: Session, name: str):
    return db.query(School).filter(School.name == name).first()
