import os
import re
from pathlib import Path

from sqlalchemy import URL


def required(name, minimum=1):
    path = os.getenv(f"{name}_FILE")
    value = Path(path).read_text().rstrip("\r\n") if path else os.getenv(name, "")
    if len(value) < minimum or value.startswith("CHANGE_ME"):
        raise RuntimeError(f"Missing or invalid {name}")
    return value


def database_url(role="APP"):
    username = required(f"DB_{role}_USER")
    if not re.fullmatch(r"[a-z_][a-z0-9_]{0,62}", username):
        raise RuntimeError(f"Invalid DB_{role}_USER")
    database = required("DB_NAME")
    if not re.fullmatch(r"[a-z_][a-z0-9_]{0,62}", database):
        raise RuntimeError("Invalid DB_NAME")
    return URL.create(
        "postgresql+psycopg", username=username,
        password=required(f"DB_{role}_PASSWORD", 24),
        host=os.getenv("DB_HOST", "db"), port=5432, database=database,
    )
