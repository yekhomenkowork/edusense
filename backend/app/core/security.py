from datetime import UTC, datetime
from hashlib import sha256
from secrets import token_urlsafe

import bcrypt
import pyotp
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy import select

from app.core.config import required
from app.database import get_db
from app.models.models import LoginSession, Membership, User

passwords = PasswordHasher()
dummy_hash = passwords.hash(token_urlsafe(32))
bearer = HTTPBearer(auto_error=False)


def verify_password(password, encoded):
    try:
        if encoded.startswith(("$2a$", "$2b$", "$2y$")):
            return bcrypt.checkpw(password.encode()[:72], encoded.encode())
        return passwords.verify(encoded, password)
    except (AttributeError, InvalidHashError, VerificationError, ValueError, TypeError):
        return False


def digest(token):
    return sha256(token.encode()).hexdigest()


def is_admin(user):
    return user.role in {"sysadmin", "system_admin"}


def verify_totp(user, code):
    if not code or user.email != required("ADMIN_EMAIL").lower():
        return False
    totp = pyotp.TOTP(required("ADMIN_TOTP_SECRET", 32))
    now = datetime.now(UTC)
    step = totp.timecode(now)
    if user.last_totp_step is not None and user.last_totp_step >= step:
        return False
    if not totp.verify(code, for_time=now):
        return False
    user.last_totp_step = step
    return True


def principal(token=Depends(bearer), db=Depends(get_db)):
    if token and len(token.credentials) <= 128:
        user = db.scalar(select(User).join(LoginSession).where(
            LoginSession.token_hash == digest(token.credentials),
            LoginSession.expires_at > datetime.now(UTC), User.active.is_(True),
        ))
        if user:
            return user
    raise HTTPException(401, "Сесія недійсна", headers={"WWW-Authenticate": "Bearer"})


def administrator(user=Depends(principal)):
    if not is_admin(user):
        raise HTTPException(403, "Недостатньо прав")
    return user


def require_school(db, user, school, write=False):
    if is_admin(user):
        return
    membership = db.get(Membership, (school, user.id))
    if not membership or (write and membership.role != "school_admin"):
        raise HTTPException(404, "Ресурс не знайдено")
