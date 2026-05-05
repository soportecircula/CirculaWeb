from __future__ import annotations

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select

from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.core.messages import (
    NIT_ALREADY_EXISTS,
    PRODUCER_NOT_FOUND,
    REP_ACCESS_REQUIRED,
    SECTOR_NOT_FOUND,
)
from app.crud.producer import (
    admin_update_producer,
    create_producer,
    get_all_producers,
    get_producer_by_id,
    get_producer_by_owner,
    get_producers_by_owner,
    update_producer_by_id,
    upsert_producer,
)
from app.crud.sector import get_all_sectors, get_or_create_sector, get_sector_by_id
from app.models.obligation import NormativeObligation
from app.models.producer import Producer
from app.models.user import PlanType, User
from app.schemas.rep import (
    NormativeObligationRead,
    ProducerAdminUpdate,
    ProducerRead,
    ProducerUpsert,
    SectorCreate,
    SectorRead,
)

router = APIRouter(prefix="/rep", tags=["rep"])

SuperuserDep = Annotated[User, Depends(get_current_active_superuser)]


_REP_ALLOWED_PLANS = {PlanType.demo_rep, PlanType.demo_col}


def _require_rep_access(current_user: CurrentUser) -> User:
    if not (current_user.is_superuser or current_user.plan_type in _REP_ALLOWED_PLANS):
        raise HTTPException(status_code=403, detail=REP_ACCESS_REQUIRED)
    return current_user


def _require_multi_producer_access(user: User) -> None:
    if not (user.is_superuser or user.plan_type == PlanType.demo_col):
        raise HTTPException(status_code=403, detail=REP_ACCESS_REQUIRED)


RepAccessDep = Annotated[User, Depends(_require_rep_access)]


# ── Sectors ──────────────────────────────────────────────────────────────────


@router.get("/sectors", response_model=list[SectorRead])
def list_sectors(session: SessionDep) -> list[SectorRead]:
    return get_all_sectors(session)  # type: ignore[return-value]


@router.post("/sectors", response_model=SectorRead, status_code=201)
def create_sector(
    body: SectorCreate,
    session: SessionDep,
    _: CurrentUser,
) -> SectorRead:
    return get_or_create_sector(session, nombre=body.nombre)  # type: ignore[return-value]


# ── Normative obligations ─────────────────────────────────────────────────────


@router.get("/obligations", response_model=list[NormativeObligationRead])
def list_obligations(session: SessionDep) -> list[NormativeObligation]:
    return list(
        session.scalars(
            select(NormativeObligation).order_by(NormativeObligation.name)
        ).all()
    )


# ── Producers (propio) ────────────────────────────────────────────────────────


@router.get("/producers/me", response_model=ProducerRead | None)
def get_my_producer(
    session: SessionDep,
    current_user: RepAccessDep,
) -> Producer | None:
    return get_producer_by_owner(session, current_user.id)


@router.put("/producers/me", response_model=ProducerRead)
def upsert_my_producer(
    body: ProducerUpsert,
    session: SessionDep,
    current_user: RepAccessDep,
) -> Producer:
    # Validar sector_id si viene
    if body.sector_id is not None:
        if not get_sector_by_id(session, body.sector_id):
            raise HTTPException(status_code=404, detail=SECTOR_NOT_FOUND)

    # Verificar NIT único (solo si cambia)
    existing = get_producer_by_owner(session, current_user.id)
    if existing is None or existing.nit != body.nit:
        dup = session.scalars(select(Producer).where(Producer.nit == body.nit)).first()
        if dup and (existing is None or dup.id != existing.id):
            raise HTTPException(status_code=409, detail=NIT_ALREADY_EXISTS)

    return upsert_producer(session, current_user.id, body)


# ── Admin producers ───────────────────────────────────────────────────────────


@router.get("/admin/producers", response_model=dict)
def list_all_producers(
    session: SessionDep,
    _: SuperuserDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
) -> dict[str, Any]:
    items, total = get_all_producers(session, skip=skip, limit=limit)
    return {"items": [ProducerRead.model_validate(p) for p in items], "total": total}


@router.get("/admin/producers/{producer_id}", response_model=ProducerRead)
def get_producer_admin(
    producer_id: uuid.UUID,
    session: SessionDep,
    _: SuperuserDep,
) -> Producer:
    producer = get_producer_by_id(session, producer_id)
    if not producer:
        raise HTTPException(status_code=404, detail=PRODUCER_NOT_FOUND)
    return producer


@router.patch("/admin/producers/{producer_id}", response_model=ProducerRead)
def update_producer_admin(
    producer_id: uuid.UUID,
    body: ProducerAdminUpdate,
    session: SessionDep,
    _: SuperuserDep,
) -> Producer:
    producer = get_producer_by_id(session, producer_id)
    if not producer:
        raise HTTPException(status_code=404, detail=PRODUCER_NOT_FOUND)

    if body.sector_id is not None:
        if not get_sector_by_id(session, body.sector_id):
            raise HTTPException(status_code=404, detail=SECTOR_NOT_FOUND)

    return admin_update_producer(session, producer, body)


# ── Producers (multi-user) ────────────────────────────────────────────────────


@router.get("/producers", response_model=list[ProducerRead])
def list_my_producers(
    session: SessionDep,
    current_user: RepAccessDep,
) -> list[Producer]:
    return get_producers_by_owner(session, current_user.id)


@router.post("/producers", response_model=ProducerRead, status_code=201)
def add_producer(
    body: ProducerUpsert,
    session: SessionDep,
    current_user: RepAccessDep,
) -> Producer:
    _require_multi_producer_access(current_user)
    if body.sector_id is not None:
        if not get_sector_by_id(session, body.sector_id):
            raise HTTPException(status_code=404, detail=SECTOR_NOT_FOUND)
    dup = session.scalars(select(Producer).where(Producer.nit == body.nit)).first()
    if dup:
        raise HTTPException(status_code=409, detail=NIT_ALREADY_EXISTS)
    return create_producer(session, current_user.id, body)


@router.put("/producers/{producer_id}", response_model=ProducerRead)
def update_producer(
    producer_id: uuid.UUID,
    body: ProducerUpsert,
    session: SessionDep,
    current_user: RepAccessDep,
) -> Producer:
    producer = get_producer_by_id(session, producer_id)
    if not producer:
        raise HTTPException(status_code=404, detail=PRODUCER_NOT_FOUND)
    if not current_user.is_superuser and producer.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail=REP_ACCESS_REQUIRED)
    if body.sector_id is not None:
        if not get_sector_by_id(session, body.sector_id):
            raise HTTPException(status_code=404, detail=SECTOR_NOT_FOUND)
    return update_producer_by_id(session, producer, body)
