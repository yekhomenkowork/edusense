"""Baseline current and legacy schools without discarding historical data."""
import sqlalchemy as sa
from alembic import op

revision = "0001_foundation"
down_revision = None


def upgrade():
    connection = op.get_bind()
    tables = set(sa.inspect(connection).get_table_names())
    schema = sa.MetaData()
    schools = sa.Table(
        "schools", schema, sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False), sa.Column("region", sa.String),
        sa.Column("city", sa.String), sa.Column("plan", sa.String), sa.Column("status", sa.String),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    users = sa.Table(
        "users", schema, sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String, unique=True, nullable=False), sa.Column("name", sa.String),
        sa.Column("hashed_password", sa.String, nullable=False), sa.Column("role", sa.String),
        sa.Column("school_id", sa.Integer, sa.ForeignKey("schools.id")),
        sa.Column("active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("last_totp_step", sa.Integer),
    )
    if "schools" in tables:
        existing = {c["name"]: c for c in sa.inspect(connection).get_columns("schools")}
        if not {"id", "name"} <= existing.keys():
            raise RuntimeError("Unsupported legacy schools schema")
        for name in ("region", "city", "plan", "status", "created_at"):
            if name not in existing:
                column = schools.c[name]
                default = column.server_default.arg if column.server_default is not None else None
                op.add_column("schools", sa.Column(name, column.type, server_default=default))
        if "created_at" in existing:
            if not existing["created_at"]["type"].timezone:
                op.alter_column("schools", "created_at", type_=sa.DateTime(timezone=True),
                                postgresql_using="created_at AT TIME ZONE 'UTC'")
            op.alter_column("schools", "created_at", server_default=sa.func.now())
        for name in ("mqtt_user", "mqtt_pass"):
            if name in existing and not existing[name]["nullable"]:
                op.alter_column("schools", name, nullable=True)
        op.execute("UPDATE schools SET plan = 'Trial' WHERE plan IS NULL")
        op.execute("UPDATE schools SET status = 'Налаштування' WHERE status IS NULL")
        op.execute("UPDATE schools SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")
    else:
        schools.create(connection)
    if "users" in tables:
        existing = {c["name"] for c in sa.inspect(connection).get_columns("users")}
        if not {"id", "email", "name", "hashed_password", "role", "school_id"} <= existing:
            raise RuntimeError("Unsupported legacy users schema")
        op.add_column("users", sa.Column("active", sa.Boolean, nullable=False, server_default=sa.true()))
        op.add_column("users", sa.Column("last_totp_step", sa.Integer))
    else:
        users.create(connection)
    op.create_table(
        "school_memberships",
        sa.Column("school_id", sa.Integer, sa.ForeignKey("schools.id"), primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), primary_key=True, index=True),
        sa.Column("role", sa.String, nullable=False),
        sa.CheckConstraint("role IN ('school_admin', 'staff')"),
    )
    op.execute(
        "INSERT INTO school_memberships SELECT u.school_id, u.id, "
        "CASE WHEN u.role = 'school_admin' THEN 'school_admin' ELSE 'staff' END "
        "FROM users u JOIN schools s ON s.id = u.school_id "
        "WHERE u.role IN ('school_admin','staff','teacher','security')"
    )
    op.create_table(
        "login_sessions", sa.Column("token_hash", sa.String(64), primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False, index=True),
    )
    op.create_table(
        "device_identities", sa.Column("id", sa.Uuid, primary_key=True),
        sa.Column("school_id", sa.Integer, sa.ForeignKey("schools.id"), nullable=False, index=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("enabled", sa.Boolean, nullable=False),
        sa.Column("last_seen", sa.DateTime(timezone=True)), sa.Column("reported_state", sa.String),
        sa.UniqueConstraint("school_id", "id"),
    )
    op.create_table(
        "telemetry_readings", sa.Column("device_id", sa.Uuid, primary_key=True),
        sa.Column("message_id", sa.Uuid, primary_key=True),
        sa.Column("metric", sa.String(40), primary_key=True),
        sa.Column("school_id", sa.Integer, nullable=False), sa.Column("value", sa.Float, nullable=False),
        sa.Column("unit", sa.String(20), nullable=False),
        sa.Column("received_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["school_id", "device_id"], ["device_identities.school_id", "device_identities.id"]),
    )
    op.create_index("ix_reading_school_device_received", "telemetry_readings", ["school_id", "device_id", "received_at"])
    op.create_table(
        "audit_events", sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("actor_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("school_id", sa.Integer, sa.ForeignKey("schools.id")),
        sa.Column("action", sa.String, nullable=False), sa.Column("target", sa.String, nullable=False),
        sa.Column("request_id", sa.String, nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )


def downgrade():
    raise RuntimeError("Use the documented recovery procedure for this baseline")
