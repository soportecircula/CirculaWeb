from typing import Any

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import SessionDep
from app.models.impact_metric import ImpactMetric
from app.schemas.impact_metric import ImpactMetricRead

router = APIRouter(prefix="/impact-metrics", tags=["impact-metrics"])


@router.get("/", response_model=list[ImpactMetricRead])
def get_impact_metrics(session: SessionDep) -> Any:
    """Obtener todas las métricas de impacto"""
    return session.execute(select(ImpactMetric)).scalars().all()