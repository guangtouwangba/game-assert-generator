from fastapi import APIRouter

from app.api.generate import router as generate_router
from app.api.history import router as history_router
from app.api.models_list import router as models_router
from app.api.images import router as images_router

api_router = APIRouter()
api_router.include_router(generate_router, tags=["generate"])
api_router.include_router(history_router, tags=["history"])
api_router.include_router(models_router, tags=["models"])
api_router.include_router(images_router, tags=["images"])
