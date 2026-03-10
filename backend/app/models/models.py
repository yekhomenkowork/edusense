from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    mqtt_user = Column(String, nullable=False)
    mqtt_pass = Column(String, nullable=False)
    
    # Підписки
    sub_monitoring = Column(Boolean, default=False)
    sub_security = Column(Boolean, default=False)
    sub_announcements = Column(Boolean, default=False)

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    school_name = Column(String, index=True, nullable=False)
    device_id = Column(String, index=True, nullable=False)
    topic = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
