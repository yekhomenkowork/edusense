from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session

from app.core.config import database_url


class Base(DeclarativeBase):
    pass


@lru_cache
def get_engine():
    return create_engine(database_url(), pool_pre_ping=True, connect_args={"connect_timeout": 5})


def get_db():
    with Session(get_engine()) as db:
        yield db
