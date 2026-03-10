from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import MQTTAuth
from app.core.config import settings
from app.models.models import School

router = APIRouter()

@router.post("/auth")
def mqtt_auth(req: MQTTAuth, db: Session = Depends(get_db)):
    # Перевірка суперкористувача (адміна)
    if req.username == settings.MQTT_USER and req.password == settings.MQTT_PASSWORD:
        return Response(status_code=200)
    
    # Перевірка пристрою школи в БД через SQLAlchemy
    school = db.query(School).filter(School.mqtt_user == req.username, School.mqtt_pass == req.password).first()
    if school:
        return Response(status_code=200)
        
    return Response(status_code=401)

@router.post("/superuser")
def mqtt_superuser(req: MQTTAuth):
    if req.username == settings.MQTT_USER:
        return Response(status_code=200)
    return Response(status_code=401)

@router.post("/acl")
def mqtt_acl(req: MQTTAuth):
    if req.username == settings.MQTT_USER:
        return Response(status_code=200)
    if req.topic and req.topic.startswith("edusense/"):
        return Response(status_code=200)
    return Response(status_code=401)
