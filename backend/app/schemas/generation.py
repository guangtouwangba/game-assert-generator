from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class SpriteConfig(BaseModel):
    rows: int = 4
    cols: int = 4
    frame_count: int = 16


class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: str | None = None
    model: str
    provider: Literal["gemini", "openrouter"]
    aspect_ratio: str = "1:1"
    image_size: str = "1024x1024"
    transparent_bg: bool = False
    reference_image_b64: str | None = None


class SpriteSheetRequest(GenerateRequest):
    is_sprite_sheet: bool = True
    sprite_config: SpriteConfig = SpriteConfig()


class GenerationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    prompt: str
    negative_prompt: str | None = None
    model: str
    provider: str
    width: int | None = None
    height: int | None = None
    aspect_ratio: str | None = None
    image_size: str | None = None
    transparent_bg: bool = False
    is_sprite_sheet: bool = False
    sprite_config: dict | None = None
    reference_image_path: str | None = None
    output_image_path: str | None = None
    thumbnail_path: str | None = None
    status: str = "pending"
    error_message: str | None = None
    metadata_json: dict | None = None
    created_at: datetime
    updated_at: datetime


class GenerationListResponse(BaseModel):
    items: list[GenerationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str


class ModelsResponse(BaseModel):
    models: list[ModelInfo]
