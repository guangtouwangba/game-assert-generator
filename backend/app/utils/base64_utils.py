import base64


def encode_image_to_base64(image_bytes: bytes) -> str:
    return base64.b64encode(image_bytes).decode("utf-8")


def decode_base64_to_bytes(b64_string: str) -> bytes:
    # Strip data URL prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    return base64.b64decode(b64_string)


def make_data_url(b64_string: str, mime_type: str = "image/png") -> str:
    if b64_string.startswith("data:"):
        return b64_string
    return f"data:{mime_type};base64,{b64_string}"
