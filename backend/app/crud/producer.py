import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.producer import Producer
from app.schemas.rep import ProducerAdminUpdate, ProducerUpsert


def get_producer_by_owner(session: Session, owner_id: uuid.UUID) -> Producer | None:
    return session.scalars(
        select(Producer).where(Producer.owner_id == owner_id)
    ).first()


def get_producers_by_owner(session: Session, owner_id: uuid.UUID) -> list[Producer]:
    return list(session.scalars(
        select(Producer).where(Producer.owner_id == owner_id)
    ).all())


def create_producer(
    session: Session, owner_id: uuid.UUID, data: ProducerUpsert
) -> Producer:
    producer = Producer(owner_id=owner_id)
    for field, value in data.model_dump(exclude_unset=False).items():
        setattr(producer, field, value)
    session.add(producer)
    session.commit()
    session.refresh(producer)
    return producer


def update_producer_by_id(
    session: Session, producer: Producer, data: ProducerUpsert
) -> Producer:
    for field, value in data.model_dump(exclude_unset=False).items():
        setattr(producer, field, value)
    session.commit()
    session.refresh(producer)
    return producer


def get_producer_by_id(session: Session, producer_id: uuid.UUID) -> Producer | None:
    return session.get(Producer, producer_id)


def get_all_producers(
    session: Session, skip: int = 0, limit: int = 100
) -> tuple[list[Producer], int]:
    total = session.scalar(select(func.count()).select_from(Producer)) or 0
    items = list(session.scalars(select(Producer).offset(skip).limit(limit)).all())
    return items, total


def upsert_producer(
    session: Session, owner_id: uuid.UUID, data: ProducerUpsert
) -> Producer:
    producer = get_producer_by_owner(session, owner_id)
    if producer is None:
        producer = Producer(owner_id=owner_id)
        session.add(producer)

    for field, value in data.model_dump(exclude_unset=False).items():
        setattr(producer, field, value)

    session.commit()
    session.refresh(producer)
    return producer


def admin_update_producer(
    session: Session, producer: Producer, data: ProducerAdminUpdate
) -> Producer:
    for field, value in data.model_dump(exclude_unset=False).items():
        setattr(producer, field, value)
    session.commit()
    session.refresh(producer)
    return producer
