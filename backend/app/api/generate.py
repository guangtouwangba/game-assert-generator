from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.generation import (
    GenerateRequest,
    SpriteSheetRequest,
    GenerationResponse,
)
from app.services.generation_service import create_generation

router = APIRouter()


@router.post("/generate", response_model=GenerationResponse)
async def generate_image(req: GenerateRequest, db: AsyncSession = Depends(get_db)):
    gen = await create_generation(
        db=db,
        prompt=req.prompt,
        model=req.model,
        provider=req.provider,
        negative_prompt=req.negative_prompt,
        aspect_ratio=req.aspect_ratio,
        image_size=req.image_size,
        transparent_bg=req.transparent_bg,
        reference_image_b64=req.reference_image_b64,
    )
    return gen


@router.post("/generate/sprite-sheet", response_model=GenerationResponse)
async def generate_sprite_sheet(
    req: SpriteSheetRequest, db: AsyncSession = Depends(get_db)
):
    gen = await create_generation(
        db=db,
        prompt=req.prompt,
        model=req.model,
        provider=req.provider,
        negative_prompt=req.negative_prompt,
        aspect_ratio=req.aspect_ratio,
        image_size=req.image_size,
        transparent_bg=req.transparent_bg,
        is_sprite_sheet=True,
        sprite_config=req.sprite_config.model_dump(),
        reference_image_b64=req.reference_image_b64,
    )
    return gen
