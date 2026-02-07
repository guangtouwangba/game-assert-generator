import asyncio
from datetime import datetime, timezone

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.generation import Generation
from app.services.gemini_provider import gemini_provider
from app.services.openrouter_provider import openrouter_provider
from app.services import file_service
from app.services.image_processor import remove_background
from app.utils.prompt_builder import build_game_asset_prompt as build_prompt


async def create_generation(
    db: AsyncSession,
    prompt: str,
    model: str,
    provider: str,
    negative_prompt: str | None = None,
    aspect_ratio: str = "1:1",
    image_size: str = "1024x1024",
    transparent_bg: bool = False,
    is_sprite_sheet: bool = False,
    sprite_config: dict | None = None,
    reference_image_b64: str | None = None,
    reference_image_path: str | None = None,
) -> Generation:
    gen = Generation(
        prompt=prompt,
        negative_prompt=negative_prompt,
        model=model,
        provider=provider,
        aspect_ratio=aspect_ratio,
        image_size=image_size,
        transparent_bg=transparent_bg,
        is_sprite_sheet=is_sprite_sheet,
        sprite_config=sprite_config,
        reference_image_path=reference_image_path,
        status="generating",
    )
    db.add(gen)
    await db.commit()
    await db.refresh(gen)

    try:
        enhanced_prompt = build_prompt(
            prompt,
            negative_prompt=negative_prompt,
            transparent_bg=transparent_bg,
            is_sprite_sheet=is_sprite_sheet,
            sprite_config=sprite_config,
        )

        if provider == "gemini":
            image_bytes = await asyncio.to_thread(
                gemini_provider.generate,
                enhanced_prompt,
                model,
                reference_image_b64,
                aspect_ratio,
                image_size,
            )
        elif provider == "openrouter":
            image_bytes = await openrouter_provider.generate(
                enhanced_prompt,
                model,
                reference_image_b64,
                aspect_ratio,
                image_size,
            )
        else:
            raise ValueError(f"Unknown provider: {provider}")

        if transparent_bg:
            image_bytes = remove_background(image_bytes)

        output_path, thumbnail_path = file_service.save_image(image_bytes, prefix="gen")

        gen.output_image_path = output_path
        gen.thumbnail_path = thumbnail_path
        gen.status = "completed"
        gen.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(gen)

    except Exception as e:
        gen.status = "failed"
        gen.error_message = str(e)
        gen.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(gen)

    return gen


async def get_generation(db: AsyncSession, generation_id: str) -> Generation | None:
    result = await db.execute(select(Generation).where(Generation.id == generation_id))
    return result.scalar_one_or_none()


async def list_generations(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    provider: str | None = None,
    search: str | None = None,
) -> tuple[list[Generation], int]:
    query = select(Generation)
    count_query = select(func.count(Generation.id))

    if provider:
        query = query.where(Generation.provider == provider)
        count_query = count_query.where(Generation.provider == provider)

    if search:
        query = query.where(Generation.prompt.ilike(f"%{search}%"))
        count_query = count_query.where(Generation.prompt.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0

    query = query.order_by(desc(Generation.created_at))
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    items = list(result.scalars().all())

    return items, total


async def delete_generation(db: AsyncSession, generation_id: str) -> bool:
    gen = await get_generation(db, generation_id)
    if not gen:
        return False

    paths_to_delete = []
    if gen.output_image_path:
        paths_to_delete.append(gen.output_image_path)
    if gen.thumbnail_path:
        paths_to_delete.append(gen.thumbnail_path)
    if gen.reference_image_path:
        paths_to_delete.append(gen.reference_image_path)

    if paths_to_delete:
        file_service.delete_files(*paths_to_delete)

    await db.delete(gen)
    await db.commit()
    return True
