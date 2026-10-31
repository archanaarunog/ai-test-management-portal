"""Initial database schema.

Revision ID: 0001_initial
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users",
        sa.Column("id", sa.String(36), primary_key=True), sa.Column("name", sa.String(160), nullable=False),
        sa.Column("email", sa.String(320), nullable=False), sa.Column("role", sa.String(40), nullable=False),
        sa.Column("avatar_initials", sa.String(8), nullable=False), sa.Column("team", sa.String(120), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False), sa.UniqueConstraint("email"))
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table("modules", sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(120), nullable=False), sa.UniqueConstraint("name"))
    op.create_table("test_cases",
        sa.Column("id", sa.String(64), primary_key=True), sa.Column("key", sa.String(32), nullable=False),
        sa.Column("title", sa.String(300), nullable=False), sa.Column("module_id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(40), nullable=False), sa.Column("priority", sa.String(24), nullable=False),
        sa.Column("status", sa.String(24), nullable=False), sa.Column("owner_id", sa.String(36)),
        sa.Column("owner_name", sa.String(160), nullable=False),
        sa.Column("automated", sa.Boolean(), nullable=False), sa.Column("description", sa.Text(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False), sa.Column("steps", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["module_id"], ["modules.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="SET NULL"), sa.UniqueConstraint("key"))
    for column in ("key", "title", "module_id", "type", "status", "automated"):
        op.create_index(f"ix_test_cases_{column}", "test_cases", [column])
    op.create_table("test_runs", sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False), sa.Column("executed_by_id", sa.String(36), nullable=False),
        sa.ForeignKeyConstraint(["executed_by_id"], ["users.id"], ondelete="RESTRICT"))
    op.create_index("ix_test_runs_started_at", "test_runs", ["started_at"])
    op.create_table("test_results", sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("test_run_id", sa.String(36), nullable=False), sa.Column("test_case_id", sa.String(64), nullable=False),
        sa.Column("status", sa.String(24), nullable=False), sa.Column("duration_seconds", sa.Integer(), nullable=False),
        sa.Column("executed_by_id", sa.String(36), nullable=False), sa.Column("executed_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["test_run_id"], ["test_runs.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["test_case_id"], ["test_cases.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["executed_by_id"], ["users.id"], ondelete="RESTRICT"))
    for column in ("test_run_id", "test_case_id", "status", "executed_at"):
        op.create_index(f"ix_test_results_{column}", "test_results", [column])
    op.create_table("activity", sa.Column("id", sa.String(64), primary_key=True), sa.Column("actor_id", sa.String(36)),
        sa.Column("action", sa.String(80), nullable=False), sa.Column("target", sa.String(400), nullable=False),
        sa.Column("status", sa.String(24), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"], ondelete="SET NULL"))
    op.create_index("ix_activity_created_at", "activity", ["created_at"])
    op.create_table("notifications", sa.Column("id", sa.String(64), primary_key=True), sa.Column("user_id", sa.String(36)),
        sa.Column("type", sa.String(24), nullable=False), sa.Column("title", sa.String(200), nullable=False),
        sa.Column("message", sa.Text(), nullable=False), sa.Column("read", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"))
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"])
    op.create_index("ix_notifications_created_at", "notifications", ["created_at"])


def downgrade() -> None:
    op.drop_table("notifications")
    op.drop_table("activity")
    op.drop_table("test_results")
    op.drop_table("test_runs")
    op.drop_table("test_cases")
    op.drop_table("modules")
    op.drop_table("users")
