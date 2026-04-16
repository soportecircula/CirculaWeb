"""add impact_metrics

Revision ID: a1f2e3d4c5b6
Revises: 3bcb427c6556
Create Date: 2026-04-14 19:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1f2e3d4c5b6'
down_revision = '3bcb427c6556'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'impact_metrics',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('key_name', sa.String(length=50), nullable=False),
        sa.Column('label', sa.String(length=100), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=20), nullable=True),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_impact_metrics_key_name'),
        'impact_metrics',
        ['key_name'],
        unique=True,
    )


def downgrade():
    op.drop_index(op.f('ix_impact_metrics_key_name'), table_name='impact_metrics')
    op.drop_table('impact_metrics')
