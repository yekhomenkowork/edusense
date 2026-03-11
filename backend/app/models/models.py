from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

event_zone_association = Table(
    'event_zone', Base.metadata,
    Column('event_id', Integer, ForeignKey('audio_events.id')),
    Column('zone_id', Integer, ForeignKey('audio_zones.id'))
)

class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    address = Column(String)
    subscription_tier = Column(String, default="basic")
    is_active = Column(Boolean, default=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    mac_address = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"))

class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    data = Column(JSON)

class AudioZone(Base):
    __tablename__ = "audio_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    volume = Column(Integer, default=50)
    play_on_lessons = Column(Boolean, default=False)
    school_id = Column(Integer, ForeignKey("schools.id"))

class AudioEvent(Base):
    __tablename__ = "audio_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)

class SecurityScenario(Base):
    __tablename__ = "security_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"))

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
