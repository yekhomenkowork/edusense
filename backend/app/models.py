from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

# Таблиця-зв'язка для подій розкладу та зон оповіщення
event_zone_association = Table(
    'event_zone', Base.metadata,
    Column('event_id', Integer, ForeignKey('audio_events.id')),
    Column('zone_id', Integer, ForeignKey('audio_zones.id'))
)

class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    subscription_tier = Column(String, default="basic") # basic, pro, custom
    is_active = Column(Boolean, default=True)
    
    # Глобальні налаштування клімату для школи
    global_climate_limits = Column(JSON, default={"co2Alert": 1000, "tempMin": 18, "tempMax": 24, "humMin": 40, "humMax": 60})

    users = relationship("User", back_populates="school")
    devices = relationship("Device", back_populates="school")
    zones = relationship("AudioZone", back_populates="school")
    scenarios = relationship("SecurityScenario", back_populates="school")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    phone = Column(String, nullable=True)
    role = Column(String) # system_admin, school_admin, security, teacher
    role_name = Column(String, nullable=True) # Напр. "Вчитель фізики"
    status = Column(String, default="offline") # online, offline, vacation
    can_trigger_alarm = Column(Boolean, default=False)
    
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    school = relationship("School", back_populates="users")

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    mac_address = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(String) # climate, door, motion, relay
    status = Column(String, default="offline")
    
    # JSON для гнучких налаштувань (ліміти CO2 або розклад охорони)
    config = Column(JSON, default={}) 
    
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="devices")

class AudioZone(Base):
    __tablename__ = "audio_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    volume = Column(Integer, default=80)
    is_muted = Column(Boolean, default=False)
    play_on_lessons = Column(Boolean, default=False)
    
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="zones")

class AudioEvent(Base):
    __tablename__ = "audio_events"
    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(String) # ID розкладу (напр. 's1' - Стандартний день)
    start_time = Column(String) # "08:30"
    end_time = Column(String)   # "08:31"
    title = Column(String)
    type = Column(String)       # bell, playlist
    track_name = Column(String)
    shuffle = Column(Boolean, default=False)
    
    school_id = Column(Integer, ForeignKey("schools.id"))
    zones = relationship("AudioZone", secondary=event_zone_association)

class SecurityScenario(Base):
    __tablename__ = "security_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    trigger_type = Column(String) # Автоматично, Вручну
    icon_type = Column(String) # air_raid, fire, lockdown, clear, custom
    
    # JSON для дій: {"audio": "...", "doors": "...", "led": "...", "push": true}
    actions = Column(JSON, default={})
    
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="scenarios")

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String) # info, warning, success, critical
    message = Column(String)
