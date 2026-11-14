import re

import pyotp
from alembic import command
from alembic.config import Config
from psycopg import sql
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session

from app.core.config import database_url, required
from app.core.logging import configure_logging
from app.core.security import is_admin, passwords
from app.models.models import User


def provision(connection, owner, app, backup):
    if len({owner.username, app.username, backup.username}) != 3:
        raise RuntimeError("Database roles must be distinct")
    with connection.connection.driver_connection.cursor() as cursor:
        for role in (app, backup):
            name = sql.Identifier(role.username)
            cursor.execute(
                "SELECT rolcanlogin AND NOT (rolsuper OR rolcreaterole OR rolcreatedb OR rolreplication OR rolbypassrls)"
                " AND NOT EXISTS (SELECT 1 FROM pg_auth_members WHERE member = pg_roles.oid)"
                " FROM pg_roles WHERE rolname = %s", (role.username,),
            )
            row = cursor.fetchone()
            if row is None:
                cursor.execute(sql.SQL("CREATE ROLE {} LOGIN PASSWORD {}").format(name, sql.Literal(role.password)))
            elif row[0]:
                cursor.execute(sql.SQL("ALTER ROLE {} PASSWORD {}").format(name, sql.Literal(role.password)))
            else:
                raise RuntimeError("Unexpected privileges for runtime database role")
            cursor.execute(sql.SQL("GRANT USAGE ON SCHEMA public TO {}").format(name))
        cursor.execute("REVOKE CREATE ON SCHEMA public FROM PUBLIC")
        for kind in ("TABLES", "SEQUENCES"):
            cursor.execute(sql.SQL("GRANT SELECT ON ALL " + kind + " IN SCHEMA public TO {}").format(
                sql.Identifier(backup.username),
            ))
        name = sql.Identifier(app.username)
        cursor.execute(sql.SQL(
            "GRANT SELECT (id, name, region, city, plan, status, created_at),"
            " INSERT (name, region, city, plan, status), UPDATE (name, region, city, plan, status)"
            " ON schools TO {}"
        ).format(name))
        for privileges, table in (
            ("SELECT, INSERT, UPDATE", "users"),
            ("SELECT, INSERT, DELETE", "school_memberships"),
            ("SELECT, INSERT, DELETE", "login_sessions"),
            ("SELECT, INSERT, UPDATE", "device_identities"),
            ("SELECT, INSERT", "telemetry_readings"),
            ("INSERT", "audit_events"),
        ):
            cursor.execute(sql.SQL("GRANT " + privileges + " ON {} TO {}").format(
                sql.Identifier(table), name,
            ))
        cursor.execute(sql.SQL("GRANT SELECT (id, occurred_at) ON audit_events TO {}").format(name))
        for table in ("schools", "users", "audit_events"):
            cursor.execute("SELECT pg_get_serial_sequence(%s, 'id')", (table,))
            sequence = cursor.fetchone()[0]
            if sequence:
                cursor.execute(sql.SQL("GRANT USAGE ON SEQUENCE {} TO {}").format(
                    sql.Identifier(*sequence.split(".")), name,
                ))


def main():
    configure_logging()
    owner, app, backup = (database_url(role) for role in ("OWNER", "APP", "BACKUP"))
    email = required("ADMIN_EMAIL").strip().lower()
    password = required("ADMIN_PASSWORD", 16)
    totp = required("ADMIN_TOTP_SECRET", 32)
    if len({owner.password, app.password, backup.password, password}) != 4:
        raise RuntimeError("Use different database and administrator passwords")
    if not re.fullmatch(r"[^@\s]+@[^@\s]+", email) or not re.fullmatch(r"[A-Z2-7]{32,128}", totp):
        raise RuntimeError("Invalid administrator configuration")
    pyotp.TOTP(totp).now()
    engine = create_engine(owner)
    try:
        with engine.begin() as connection:
            connection.execute(text("SELECT pg_advisory_xact_lock(516863641)"))
            config = Config("alembic.ini")
            config.attributes["connection"] = connection
            command.upgrade(config, "head")
            provision(connection, owner, app, backup)
            with Session(bind=connection) as db:
                user = db.scalar(select(User).where(User.email == email))
                if user is None:
                    db.add(User(email=email, name="Адміністратор EduSense",
                                hashed_password=passwords.hash(password), role="sysadmin"))
                elif not is_admin(user) or not user.active:
                    raise RuntimeError("Configured administrator conflicts with an existing account")
                db.flush()
    except Exception as error:
        # SQL rendered for DDL can contain credentials. Never print the raw error.
        raise SystemExit(f"Migration or initialization failed ({type(error).__name__})") from None
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
