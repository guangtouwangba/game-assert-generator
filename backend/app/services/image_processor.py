import io

from PIL import Image


def remove_background(image_bytes: bytes, threshold: int = 240) -> bytes:
    """Remove near-white background by setting matching pixels to transparent.

    Pixels where R, G, and B are all above *threshold* get alpha set to 0.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    pixdata = img.load()

    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, _a = pixdata[x, y]
            if r > threshold and g > threshold and b > threshold:
                pixdata[x, y] = (r, g, b, 0)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def assemble_sprite_sheet(frames: list[bytes], cols: int, rows: int) -> bytes:
    """Arrange image frames into a sprite sheet grid of *cols* x *rows*.

    All frames are resized to match the first frame's dimensions if they differ.
    """
    if not frames:
        raise ValueError("frames list must not be empty")

    images = [Image.open(io.BytesIO(f)).convert("RGBA") for f in frames]
    frame_w, frame_h = images[0].size

    sheet = Image.new("RGBA", (frame_w * cols, frame_h * rows), (0, 0, 0, 0))

    for idx, img in enumerate(images):
        if idx >= cols * rows:
            break
        if img.size != (frame_w, frame_h):
            img = img.resize((frame_w, frame_h), Image.LANCZOS)
        col = idx % cols
        row = idx // cols
        sheet.paste(img, (col * frame_w, row * frame_h))

    buf = io.BytesIO()
    sheet.save(buf, format="PNG")
    return buf.getvalue()


def add_transparency(image_bytes: bytes) -> bytes:
    """Convert image to RGBA format and return as PNG bytes."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
