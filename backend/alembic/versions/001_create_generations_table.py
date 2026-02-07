"""create generations table

Revision ID: 001
Revises:
Create Date: 2026-02-07
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "generations",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("negative_prompt", sa.Text(), nullable=True),
        sa.Column("model", sa.String(100), nullable=False),
        sa.Column("provider", sa.String(20), nullable=False),
        sa.Column("width", sa.Integer(), nullable=True),
        sa.Column("height", sa.Integer(), nullable=True),
        sa.Column("aspect_ratio", sa.String(10), nullable=True),
        sa.Column("image_size", sa.String(10), nullable=True),
        sa.Column("transparent_bg", sa.Boolean(), server_default=sa.false()),
        sa.Column("is_sprite_sheet", sa.Boolean(), server_default=sa.false()),
        sa.Column("sprite_config", sa.JSON(), nullable=True),
        sa.Column("reference_image_path", sa.String(500), nullable=True),
        sa.Column("output_image_path", sa.String(500), nullable=True),
        sa.Column("thumbnail_path", sa.String(500), nullable=True),
        sa.Column("status", sa.String(20), server_default="pending"),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_generations_status", "generations", ["status"])
    op.create_index("ix_generations_created_at", "generations", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_generations_created_at", table_name="generations")
    op.drop_index("ix_generations_status", table_name="generations")
    op.drop_table("generations")
