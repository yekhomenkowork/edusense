import logging
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe
from typing import Annotated, Literal
from uuid import UUID, uuid4

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, StringConstraints
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import database_url
from app.core.logging import configure_logging
from app.core.security import (
    administrator, bearer, digest, dummy_hash, is_admin, passwords, principal,
    require_school, verify_password, verify_totp,
)
from app.database import get_db, get_engine
from app.models.models import AuditEvent, Device, LoginSession, Membership, Reading, School, User

logger = logging.getLogger("edusense.api")
Db = Annotated[Session, Depends(get_db)]
Principal = Annotated[User, Depends(principal)]
Admin = Annotated[User, Depends(administrator)]
Label = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
Email = Annotated[str, StringConstraints(strip_whitespace=True, to_lower=True, pattern=r"^[^@\s]+@[^@\s]+$", max_length=254)]


@asynccontextmanager
async def lifespan(_app):
    configure_logging()
    database_url()
    yield


app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)


@app.exception_handler(RequestValidationError)
async def invalid_request(_request, _exception):
    return JSONResponse({"detail": "Некоректні дані запиту"}, status_code=422)


@app.middleware("http")
async def correlate(request, call_next):
    request.state.request_id = uuid4().hex
    try:
        response = await call_next(request)
    except IntegrityError:
        response = JSONResponse({"detail": "Конфлікт даних"}, status_code=409)
    except SQLAlchemyError:
        logger.error("database_error request_id=%s", request.state.request_id)
        response = JSONResponse({"detail": "База даних недоступна"}, status_code=503)
    response.headers["X-Request-ID"] = request.state.request_id
    response.headers["Cache-Control"] = "no-store"
    return response


class Login(BaseModel):
    email: Email
    password: Annotated[str, StringConstraints(min_length=1, max_length=1024)]
    otp: Annotated[str, StringConstraints(pattern=r"^[0-9]{6}$")] | None = None


class SchoolInput(BaseModel):
    name: Label
    city: Label | None = None
    region: Label | None = None
    plan: Label = "Trial"
    status: Label = "Налаштування"


class SchoolView(SchoolInput):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class MemberInput(BaseModel):
    email: Email
    name: Label
    role: Literal["school_admin", "staff"]
    password: Annotated[str, StringConstraints(min_length=16, max_length=1024)] | None = None


class DeviceInput(BaseModel):
    name: Label


def audit(db, request, user, action, target, school=None):
    db.add(AuditEvent(actor_id=user.id, school_id=school, action=action,
                      target=str(target), request_id=request.state.request_id))


@app.get("/health/live")
def live():
    return {"status": "live"}


@app.get("/health/ready")
def ready():
    with get_engine().connect() as connection:
        connection.execute(select(Membership.school_id).limit(1))
    return {"status": "ready"}


@app.get("/api/system/metrics")
def metrics(_user: Admin):
    return {"db_status": ready()["status"]}


@app.post("/api/auth/login")
def login(data: Login, request: Request, db: Db):
    user = db.scalar(select(User).where(User.email == data.email).with_for_update())
    valid = verify_password(data.password, user.hashed_password if user else dummy_hash)
    if not user or not user.active or not valid or (is_admin(user) and not verify_totp(user, data.otp)):
        logger.warning("login_denied request_id=%s", request.state.request_id)
        raise HTTPException(401, "Невірні дані або одноразовий код")
    if user.hashed_password.startswith("$2") or passwords.check_needs_rehash(user.hashed_password):
        user.hashed_password = passwords.hash(data.password)
    token = token_urlsafe(32)
    now = datetime.now(UTC)
    db.execute(delete(LoginSession).where(LoginSession.user_id == user.id, LoginSession.expires_at <= now))
    db.add(LoginSession(token_hash=digest(token), user_id=user.id, expires_at=now + timedelta(hours=8)))
    audit(db, request, user, "login", user.id)
    db.commit()
    display_role = "staff"
    if is_admin(user):
        display_role = "sysadmin"
    elif db.scalar(select(Membership.user_id).where(
        Membership.user_id == user.id, Membership.role == "school_admin",
    ).limit(1)):
        display_role = "school_admin"
    return {"access_token": token, "user": {"id": user.id, "name": user.name, "role": display_role}}


@app.post("/api/auth/logout", status_code=204)
def logout(db: Db, _user: Principal, token=Depends(bearer)):
    db.execute(delete(LoginSession).where(LoginSession.token_hash == digest(token.credentials)))
    db.commit()
    return Response(status_code=204)


@app.get("/api/schools", response_model=list[SchoolView])
def schools(db: Db, user: Principal):
    query = select(School).order_by(School.id)
    if not is_admin(user):
        query = query.join(Membership).where(Membership.user_id == user.id)
    return db.scalars(query).all()


@app.get("/api/schools/{school_id}/capabilities")
def core_capabilities(school_id: int, db: Db, user: Principal):
    school_detail(school_id, db, user)
    return {"permanent_free": [
        "school_bells", "air_raid_indication", "approved_shelter_routes",
        "essential_diagnostics", "security_updates",
    ]}


@app.post("/api/schools", response_model=SchoolView, status_code=201)
def create_school(data: SchoolInput, request: Request, db: Db, user: Admin):
    school = School(**data.model_dump())
    db.add(school)
    db.flush()
    audit(db, request, user, "school.create", school.id, school.id)
    db.commit()
    return school


@app.get("/api/schools/{school_id}", response_model=SchoolView)
def school_detail(school_id: int, db: Db, user: Principal):
    require_school(db, user, school_id)
    school = db.get(School, school_id)
    if school is None:
        raise HTTPException(404, "Школу не знайдено")
    return school


@app.put("/api/schools/{school_id}", response_model=SchoolView)
def update_school(school_id: int, data: SchoolInput, request: Request, db: Db, user: Admin):
    school = school_detail(school_id, db, user)
    for key, value in data.model_dump().items():
        setattr(school, key, value)
    audit(db, request, user, "school.update", school_id, school_id)
    db.commit()
    return school


def member_view(user, membership):
    return {"id": user.id, "email": user.email, "name": user.name, "role": membership.role}


@app.get("/api/schools/{school_id}/users")
def list_members(school_id: int, db: Db, user: Principal):
    require_school(db, user, school_id, write=True)
    school_detail(school_id, db, user)
    rows = db.execute(select(User, Membership).join(Membership).where(Membership.school_id == school_id))
    return [member_view(member, membership) for member, membership in rows]


@app.post("/api/schools/{school_id}/users", status_code=201)
def add_member(school_id: int, data: MemberInput, request: Request, db: Db, user: Admin):
    school_detail(school_id, db, user)
    member = db.scalar(select(User).where(User.email == data.email))
    if member is None:
        if not data.password:
            raise HTTPException(422, "Потрібен пароль для нового облікового запису")
        member = User(name=data.name, email=data.email, hashed_password=passwords.hash(data.password))
        db.add(member)
        db.flush()
    elif data.password or is_admin(member):
        raise HTTPException(409, "Конфлікт облікового запису")
    membership = Membership(school_id=school_id, user_id=member.id, role=data.role)
    db.add(membership)
    audit(db, request, user, "member.add", member.id, school_id)
    db.commit()
    return member_view(member, membership)


@app.delete("/api/schools/{school_id}/users/{user_id}", status_code=204)
def remove_member(school_id: int, user_id: int, request: Request, db: Db, user: Admin):
    membership = db.get(Membership, (school_id, user_id))
    if membership is None:
        raise HTTPException(404, "Членство не знайдено")
    db.delete(membership)
    audit(db, request, user, "member.remove", user_id, school_id)
    db.commit()


@app.post("/api/schools/{school_id}/devices", status_code=201)
def add_device(school_id: int, data: DeviceInput, request: Request, db: Db, user: Principal):
    require_school(db, user, school_id, write=True)
    school_detail(school_id, db, user)
    device = Device(id=uuid4(), name=data.name, school_id=school_id)
    db.add(device)
    audit(db, request, user, "device.add", device.id, school_id)
    db.commit()
    return {"id": device.id, "name": device.name}


@app.get("/api/schools/{school_id}/devices")
def devices(school_id: int, db: Db, user: Principal):
    school_detail(school_id, db, user)
    recent = datetime.now(UTC) - timedelta(seconds=90)
    return [
        {"id": item.id, "name": item.name, "last_seen": item.last_seen,
         "status": "online" if item.reported_state == "online" and item.enabled and item.last_seen
         and item.last_seen.replace(tzinfo=UTC) >= recent else "offline"}
        for item in db.scalars(select(Device).where(Device.school_id == school_id))
    ]


@app.delete("/api/schools/{school_id}/devices/{device_id}", status_code=204)
def disable_device(school_id: int, device_id: UUID, request: Request, db: Db, user: Principal):
    require_school(db, user, school_id, write=True)
    device = db.get(Device, device_id, with_for_update=True)
    if device is None or device.school_id != school_id:
        raise HTTPException(404, "Пристрій не знайдено")
    device.enabled = False
    audit(db, request, user, "device.disable", device_id, school_id)
    db.commit()


@app.get("/api/schools/{school_id}/devices/{device_id}/telemetry")
def telemetry(school_id: int, device_id: UUID, db: Db, user: Principal):
    require_school(db, user, school_id)
    device = db.get(Device, device_id)
    if device is None or device.school_id != school_id:
        raise HTTPException(404, "Пристрій не знайдено")
    rows = db.scalars(select(Reading).where(Reading.school_id == school_id, Reading.device_id == device_id)
                      .order_by(Reading.received_at.desc()).limit(100))
    return [{"metric": r.metric, "value": r.value, "unit": r.unit, "received_at": r.received_at} for r in rows]
