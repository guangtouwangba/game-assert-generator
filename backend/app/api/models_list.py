from fastapi import APIRouter

from app.schemas.generation import ModelsResponse
from app.services.gemini_provider import gemini_provider
from app.services.openrouter_provider import openrouter_provider

router = APIRouter()


@router.get("/models", response_model=ModelsResponse)
async def list_models():
    models = gemini_provider.list_models() + openrouter_provider.list_models()
    return ModelsResponse(models=models)
