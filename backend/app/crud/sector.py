import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.sector import Sector


def get_all_sectors(session: Session) -> list[Sector]:
    return list(
        session.scalars(
            select(Sector).order_by(Sector.es_predefinido.desc(), Sector.nombre)
        ).all()
    )


def get_sector_by_id(session: Session, sector_id: uuid.UUID) -> Sector | None:
    return session.get(Sector, sector_id)


def get_or_create_sector(session: Session, nombre: str) -> Sector:
    existing = session.scalars(select(Sector).where(Sector.nombre == nombre)).first()
    if existing:
        return existing
    sector = Sector(nombre=nombre, es_predefinido=False)
    session.add(sector)
    session.commit()
    session.refresh(sector)
    return sector
