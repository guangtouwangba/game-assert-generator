from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse

from app.services import file_service

router = APIRouter()


@router.get("/images/{folder}/{filename}")
async def serve_image(folder: str, filename: str):
    if folder not in ("outputs", "uploads"):
        raise HTTPException(status_code=400, detail="Invalid folder")

    file_path = file_service.get_file_path(f"public/{folder}/{filename}")
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    suffix = file_path.suffix.lower()
    media_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    media_type = media_types.get(suffix, "application/octet-stream")
    return FileResponse(file_path, media_type=media_type)


@router.post("/upload-reference")
async def upload_reference(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    path = file_service.save_upload(contents, file.filename or "upload.png")
    return {"path": path, "filename": Path(path).name}
