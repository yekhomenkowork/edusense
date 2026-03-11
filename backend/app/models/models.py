from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# ==========================================
# 1. ОСНОВНІ СУТНОСТІ
# ==========================================
class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String)
    city = Column(String)
    plan = Column(String, default="Trial")
    status = Column(String, default="Налаштування")
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="school")
    devices = relationship("Device", back_populates="school")
    audio_zones = relationship("AudioZone", back_populates="school")
    scenarios = relationship("SecurityScenario", back_populates="school")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    role = Column(String, default="staff") # sysadmin, school_admin, staff
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)

    school = relationship("School", back_populates="users")

# ==========================================
# 2. ESP32 ТА МІКРОКЛІМАТ (IoT)
# ==========================================
class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    mac_address = Column(String, unique=True, index=True, nullable=False)
    room_name = Column(String, nullable=False)
    status = Column(String, default="offline")
    school_id = Column(Integer, ForeignKey("schools.id"))
    last_seen = Column(DateTime, default=datetime.utcnow)

    school = relationship("School", back_populates="devices")
    sensor_data = relationship("SensorData", back_populates="device")

class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    co2_level = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    device = relationship("Device", back_populates="sensor_data")

# ==========================================
# 3. АУДІО ТА РОЗКЛАД
# ==========================================
class AudioZone(Base):
    __tablename__ = "audio_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"))
    
    school = relationship("School", back_populates="audio_zones")
    events = relationship("AudioEvent", back_populates="zone")

class AudioEvent(Base):
    __tablename__ = "audio_events"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    time = Column(String, nullable=False)
    zone_id = Column(Integer, ForeignKey("audio_zones.id"))
    
    zone = relationship("AudioZone", back_populates="events")

# ==========================================
# 4. БЕЗПЕКА ТА СИСТЕМА
# ==========================================
class SecurityScenario(Base):
    __tablename__ = "security_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # Наприклад: Евакуація, Тривога
    is_active = Column(Boolean, default=False)
    school_id = Column(Integer, ForeignKey("schools.id"))

    school = relationship("School", back_populates="scenarios")

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    level = Column(String, default="INFO") # INFO, WARNING, ERROR, CRITICAL
    timestamp = Column(DateTime, default=datetime.utcnow)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
