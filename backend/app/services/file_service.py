import uuid
from pathlib import Path

from PIL import Image
import io

from app.config import settings

THUMBNAIL_SIZE = (256, 256)


def save_image(image_bytes: bytes, prefix: str = "gen") -> tuple[str, str]:
    """Save image bytes to OUTPUT_DIR and generate a 256x256 thumbnail.

    Returns a tuple of (output_path, thumbnail_path) as relative paths.
    """
    output_dir = settings.output_path
    unique_id = uuid.uuid4().hex
    filename = f"{prefix}_{unique_id}.png"
    thumb_filename = f"{prefix}_{unique_id}_thumb.png"

    output_file = output_dir / filename
    thumb_file = output_dir / thumb_filename

    output_file.write_bytes(image_bytes)

    img = Image.open(io.BytesIO(image_bytes))
    img.thumbnail(THUMBNAIL_SIZE)
    img.save(thumb_file, format="PNG")

    return str(Path(settings.OUTPUT_DIR) / filename), str(Path(settings.OUTPUT_DIR) / thumb_filename)


def save_upload(file_bytes: bytes, original_filename: str) -> str:
    """Save uploaded reference image to UPLOAD_DIR with UUID prefix.

    Returns relative path to the saved file.
    """
    upload_dir = settings.upload_path
    unique_id = uuid.uuid4().hex
    safe_name = Path(original_filename).name
    filename = f"{unique_id}_{safe_name}"

    upload_file = upload_dir / filename
    upload_file.write_bytes(file_bytes)

    return str(Path(settings.UPLOAD_DIR) / filename)


def delete_files(*paths: str) -> None:
    """Delete files by their relative paths. Silently skip missing files."""
    for rel_path in paths:
        full_path = get_file_path(rel_path)
        if full_path.is_file():
            full_path.unlink()


def get_file_path(relative_path: str) -> Path:
    """Resolve a relative path to an absolute path from the backend directory."""
    return Path(relative_path).resolve()
