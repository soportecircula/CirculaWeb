from fastapi import APIRouter

from app.api.routes import auth, contact, login, users, utils, impact_metrics

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(impact_metrics.router)
api_router.include_router(contact.router)

