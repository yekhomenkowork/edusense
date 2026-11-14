from datetime import datetime
from uuid import UUID

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, ForeignKeyConstraint, Index, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class School(Base):
    __tablename__ = "schools"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    region: Mapped[str | None]
    city: Mapped[str | None]
    plan: Mapped[str] = mapped_column(default="Trial")
    status: Mapped[str] = mapped_column(default="Налаштування")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str | None]
    hashed_password: Mapped[str]
    role: Mapped[str] = mapped_column(default="staff")
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id"))
    active: Mapped[bool] = mapped_column(default=True)
    last_totp_step: Mapped[int | None]


class Membership(Base):
    __tablename__ = "school_memberships"
    __table_args__ = (CheckConstraint("role IN ('school_admin', 'staff')"),)
    school_id: Mapped[int] = mapped_column(ForeignKey("schools.id"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True, index=True)
    role: Mapped[str]


class LoginSession(Base):
    __tablename__ = "login_sessions"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Device(Base):
    __tablename__ = "device_identities"
    __table_args__ = (UniqueConstraint("school_id", "id"),)
    id: Mapped[UUID] = mapped_column(primary_key=True)
    school_id: Mapped[int] = mapped_column(ForeignKey("schools.id"), index=True)
    name: Mapped[str]
    enabled: Mapped[bool] = mapped_column(default=True)
    last_seen: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    reported_state: Mapped[str | None]


class Reading(Base):
    __tablename__ = "telemetry_readings"
    __table_args__ = (
        ForeignKeyConstraint(["school_id", "device_id"], ["device_identities.school_id", "device_identities.id"]),
        Index("ix_reading_school_device_received", "school_id", "device_id", "received_at"),
    )
    device_id: Mapped[UUID] = mapped_column(primary_key=True)
    message_id: Mapped[UUID] = mapped_column(primary_key=True)
    metric: Mapped[str] = mapped_column(String(40), primary_key=True)
    school_id: Mapped[int]
    value: Mapped[float]
    unit: Mapped[str] = mapped_column(String(20))
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class AuditEvent(Base):
    __tablename__ = "audit_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id"))
    action: Mapped[str]
    target: Mapped[str]
    request_id: Mapped[str]
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
