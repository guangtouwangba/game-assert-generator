import base64

from google import genai
from google.genai import types

from app.config import settings

AVAILABLE_MODELS = [
    {
        "id": "gemini-2.5-flash-image",
        "name": "Gemini 2.5 Flash Image (Fast)",
        "provider": "gemini",
    },
    {
        "id": "gemini-3-pro-image-preview",
        "name": "Gemini 3 Pro Image (High Quality)",
        "provider": "gemini",
    },
]


class GeminiProvider:
    def __init__(self, api_key: str) -> None:
        self._client = genai.Client(api_key=api_key)

    def generate(
        self,
        prompt: str,
        model: str,
        ref_image_b64: str | None = None,
        aspect_ratio: str = "1:1",
        image_size: str = "1K",
    ) -> bytes:
        if ref_image_b64 is not None:
            # Strip data-URL prefix so we have raw base64
            raw_b64 = ref_image_b64
            mime_type = "image/png"
            if raw_b64.startswith("data:"):
                header, raw_b64 = raw_b64.split(",", 1)
                # e.g. "data:image/png;base64" -> "image/png"
                mime_type = header.split(":")[1].split(";")[0]

            image_bytes = base64.b64decode(raw_b64)

            contents = [
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                types.Part.from_text(text=prompt),
            ]
        else:
            contents = [prompt]

        response = self._client.models.generate_content(
            model=model,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["Image", "Text"],
            ),
        )

        # Extract image bytes from the first candidate's parts
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                return part.inline_data.data

        raise ValueError("No image data found in Gemini response")

    def list_models(self) -> list[dict]:
        return list(AVAILABLE_MODELS)


gemini_provider = GeminiProvider(settings.GEMINI_API_KEY)
