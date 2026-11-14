from alembic import context
from sqlalchemy import create_engine

from app.core.config import database_url
from app.database import Base
from app.models import models  # noqa: F401


def run(connection):
    context.configure(connection=connection, target_metadata=Base.metadata)
    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    raise RuntimeError("The baseline migration inspects a live schema")
connection = context.config.attributes.get("connection")
if connection is None:
    with create_engine(database_url("OWNER")).connect() as connection:
        run(connection)
else:
    run(connection)
