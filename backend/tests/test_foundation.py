import json
from uuid import uuid4

import pyotp
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.core.security import passwords
from app.database import Base, get_db
from app.main import app
from app.models.models import Membership, School, User
from worker.protocol import decode


@pytest.fixture()
def server(monkeypatch):
    monkeypatch.setenv("ADMIN_EMAIL", "admin@example.invalid")
    totp = pyotp.random_base32()
    monkeypatch.setenv("ADMIN_TOTP_SECRET", totp)
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    password = "test-only-operator-phrase"
    with Session(engine) as db:
        encoded = passwords.hash(password)
        db.add_all([School(id=1, name="A", plan="Expired"), School(id=2, name="B")])
        db.add_all([
            User(id=1, email="a@example.invalid", hashed_password=encoded),
            User(id=2, email="b@example.invalid", hashed_password=encoded),
            User(id=3, email="admin@example.invalid", hashed_password=encoded, role="sysadmin"),
        ])
        db.flush()
        db.add_all([Membership(school_id=1, user_id=1, role="school_admin"),
                    Membership(school_id=2, user_id=1, role="staff"),
                    Membership(school_id=2, user_id=2, role="school_admin")])
        db.commit()

    def override():
        with Session(engine) as db:
            yield db

    app.dependency_overrides[get_db] = override

    def authenticate(email, otp=None):
        return client.post("/api/auth/login", json={"email": email, "password": password, "otp": otp})

    client = TestClient(app)
    try:
        yield client, authenticate, totp
    finally:
        app.dependency_overrides.clear()
        engine.dispose()


def headers(response):
    assert response.status_code == 200, response.text
    return {"Authorization": "Bearer " + response.json()["access_token"]}


def test_tenants_and_roles(server):
    client, auth, _ = server
    assert client.get("/api/schools").status_code == 401
    a, b = (headers(auth(email)) for email in ("a@example.invalid", "b@example.invalid"))
    assert len(client.get("/api/schools", headers=a).json()) == 2
    assert client.get("/api/schools/1", headers=b).status_code == 404
    assert client.get("/api/schools/1/users", headers=b).status_code == 404
    assert client.get("/api/schools/1/capabilities", headers=b).status_code == 404
    assert client.get("/api/schools/1/capabilities", headers=a).json() == client.get(
        "/api/schools/2/capabilities", headers=a
    ).json()
    assert client.get("/api/schools/2/users", headers=a).status_code == 404
    assert client.get("/api/system/metrics", headers=a).status_code == 403
    device = client.post("/api/schools/1/devices", headers=a, json={"name": "Fixture"})
    assert device.status_code == 201
    identity = device.json()["id"]
    assert client.get(f"/api/schools/2/devices/{identity}/telemetry", headers=b).status_code == 404
    assert client.delete(f"/api/schools/2/devices/{identity}", headers=b).status_code == 404
    assert client.get(f"/api/schools/1/devices/{identity}/telemetry", headers=a).status_code == 200


def test_mfa_and_revocation(server):
    client, auth, secret = server
    assert auth("admin@example.invalid").status_code == 401
    code = pyotp.TOTP(secret).now()
    admin = headers(auth("admin@example.invalid", code))
    assert auth("admin@example.invalid", code).status_code == 401
    staff = headers(auth("b@example.invalid"))
    assert client.post("/api/schools/1/users", headers=admin, json={
        "email": "b@example.invalid", "name": "Staff", "role": "staff",
    }).status_code == 201
    assert client.get("/api/schools/1", headers=staff).status_code == 200
    assert client.delete("/api/schools/1/users/2", headers=admin).status_code == 204
    assert client.get("/api/schools/1", headers=staff).status_code == 404
    assert client.post("/api/auth/logout", headers=staff).status_code == 204
    assert client.get("/api/schools/2", headers=staff).status_code == 401


def test_telemetry_schema():
    device = uuid4()
    payload = {"schema_version": 1, "message_id": str(uuid4()),
               "metrics": [{"name": "temperature", "value": 21.5, "unit": "Cel"}]}
    prefix = f"edusense/v1/devices/{device}"
    identity, message = decode(prefix + "/telemetry", json.dumps(payload).encode())
    assert identity == device
    assert message.metrics[0].value == 21.5
    payload["metrics"][0]["unit"] = "ppm"
    with pytest.raises(ValueError):
        decode(prefix + "/telemetry", json.dumps(payload).encode())
