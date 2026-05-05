"""sectors_producers_uuid_pk

Revision ID: 8f3c91a2b4d0
Revises: 2da1b6111828
Create Date: 2026-05-04

Recrea sectors y producers con PK UUID (alineado a users.id).
"""

import sqlalchemy as sa
from alembic import op

revision = "8f3c91a2b4d0"
down_revision = "2da1b6111828"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_table("producers")
    op.drop_table("sectors")
    for typ in ("tipoproductor", "cuentaconplan", "estadoproductor"):
        op.execute(sa.text(f"DROP TYPE IF EXISTS {typ} CASCADE"))

    op.create_table(
        "sectors",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("nombre", sa.String(length=100), nullable=False),
        sa.Column("es_predefinido", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nombre", name="uq_sectors_nombre"),
    )
    op.create_table(
        "producers",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("owner_id", sa.Uuid(), nullable=False),
        sa.Column("sector_id", sa.Uuid(), nullable=True),
        sa.Column("razon_social", sa.String(length=200), nullable=False),
        sa.Column("nit", sa.String(length=30), nullable=False),
        sa.Column("ciudad", sa.String(length=100), nullable=True),
        sa.Column("departamento", sa.String(length=100), nullable=True),
        sa.Column("direccion", sa.String(length=255), nullable=True),
        sa.Column("correo", sa.String(length=255), nullable=True),
        sa.Column("contacto", sa.String(length=30), nullable=True),
        sa.Column("nombre_responsable", sa.String(length=200), nullable=True),
        sa.Column(
            "tipo",
            sa.Enum("fabricante", "importador", name="tipoproductor"),
            nullable=True,
        ),
        sa.Column(
            "cuenta_con_plan",
            sa.Enum("individual", "colectivo", "no", name="cuentaconplan"),
            nullable=True,
        ),
        sa.Column("en_incumplimiento_rep", sa.Boolean(), nullable=False),
        sa.Column("obligaciones_normativas", sa.JSON(), nullable=True),
        sa.Column(
            "estado",
            sa.Enum("activo", "inactivo", name="estadoproductor"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["sector_id"], ["sectors.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nit", name="uq_producers_nit"),
        sa.UniqueConstraint("owner_id", name="uq_producers_owner_id"),
    )


def downgrade() -> None:
    op.drop_table("producers")
    op.drop_table("sectors")
    for typ in ("tipoproductor", "cuentaconplan", "estadoproductor"):
        op.execute(sa.text(f"DROP TYPE IF EXISTS {typ} CASCADE"))

    op.create_table(
        "sectors",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nombre", sa.String(length=100), nullable=False),
        sa.Column("es_predefinido", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nombre", name="uq_sectors_nombre"),
    )
    op.create_table(
        "producers",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("owner_id", sa.Uuid(), nullable=False),
        sa.Column("sector_id", sa.Integer(), nullable=True),
        sa.Column("razon_social", sa.String(length=200), nullable=False),
        sa.Column("nit", sa.String(length=30), nullable=False),
        sa.Column("ciudad", sa.String(length=100), nullable=True),
        sa.Column("departamento", sa.String(length=100), nullable=True),
        sa.Column("direccion", sa.String(length=255), nullable=True),
        sa.Column("correo", sa.String(length=255), nullable=True),
        sa.Column("contacto", sa.String(length=30), nullable=True),
        sa.Column("nombre_responsable", sa.String(length=200), nullable=True),
        sa.Column(
            "tipo",
            sa.Enum("fabricante", "importador", name="tipoproductor"),
            nullable=True,
        ),
        sa.Column(
            "cuenta_con_plan",
            sa.Enum("individual", "colectivo", "no", name="cuentaconplan"),
            nullable=True,
        ),
        sa.Column("en_incumplimiento_rep", sa.Boolean(), nullable=False),
        sa.Column("obligaciones_normativas", sa.JSON(), nullable=True),
        sa.Column(
            "estado",
            sa.Enum("activo", "inactivo", name="estadoproductor"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["sector_id"], ["sectors.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nit", name="uq_producers_nit"),
        sa.UniqueConstraint("owner_id", name="uq_producers_owner_id"),
    )
