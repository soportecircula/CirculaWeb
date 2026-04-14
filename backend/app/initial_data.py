import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud.user import create_user
from app.db.session import engine
from app.models.impact_metric import ImpactMetric
from app.models.user import User
from app.schemas.user import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _ensure_superuser(session: Session) -> User:
    from app.core.security import get_password_hash, verify_password

    user = session.scalars(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
            full_name="Super Admin",
        )
        user = create_user(session=session, user_create=user_in)
        logger.info("Superuser '%s' created", settings.FIRST_SUPERUSER)
    else:
        ok, _ = verify_password(settings.FIRST_SUPERUSER_PASSWORD, user.hashed_password)
        if not ok:
            user.hashed_password = get_password_hash(settings.FIRST_SUPERUSER_PASSWORD)
            user.is_superuser = True
            session.add(user)
            session.commit()
            logger.info("Superuser '%s' password synced", settings.FIRST_SUPERUSER)
    return user

_IMPACT_METRICS_SEED = [
    {
        "key_name": "produc",
        "label": "Productores",
        "value": 60,
        "unit": "+",
        "description": "Afiliados a planes individuales y colectivos sobre una misma arquitectura.",
    },
    {
        "key_name": "plan_in_col",
        "label": "Planes individuales y colectivos",
        "value": 15,
        "unit": "+",
        "description": "Planes que articulan trazabilidad, gestión y cumplimiento sobre la plataforma.",
    },
    {
        "key_name": "opera",
        "label": "Operadores",
        "value": 12,
        "unit": "+",
        "description": "Entre gestores, transformadores y cooperativas que fortalecen la capacidad real de ejecución.",
    },
    {
        "key_name": "tons_rec",
        "label": "Toneladas Trazadas",
        "value": 100,
        "unit": "+",
        "description": "Material recolectado que demuestra tracción operativa y capacidad de escalamiento.",
    },
]


def _ensure_impact_metrics(session: Session) -> None:
    for data in _IMPACT_METRICS_SEED:
        existing = session.scalars(
            select(ImpactMetric).where(ImpactMetric.key_name == data["key_name"])
        ).first()
        if not existing:
            session.add(ImpactMetric(**data))
            logger.info("Impact metric '%s' created", data["key_name"])
    session.commit()


def init_db(session: Session) -> None:
    _ensure_superuser(session)
    _ensure_impact_metrics(session)


def init() -> None:
    with Session(engine) as session:
        init_db(session)


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
