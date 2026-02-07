import math

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.generation import GenerationResponse, GenerationListResponse
from app.services.generation_service import (
    get_generation,
    list_generations,
    delete_generation,
)

router = APIRouter()


@router.get("/history", response_model=GenerationListResponse)
async def get_history(
    page: int = 1,
    page_size: int = 20,
    provider: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    items, total = await list_generations(
        db, page=page, page_size=page_size, provider=provider, search=search
    )
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    return GenerationListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/history/{generation_id}", response_model=GenerationResponse)
async def get_generation_detail(
    generation_id: str, db: AsyncSession = Depends(get_db)
):
    gen = await get_generation(db, generation_id)
    if not gen:
        raise HTTPException(status_code=404, detail="Generation not found")
    return gen


@router.delete("/history/{generation_id}")
async def delete_generation_record(
    generation_id: str, db: AsyncSession = Depends(get_db)
):
    deleted = await delete_generation(db, generation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Generation not found")
    return {"detail": "Deleted successfully"}
