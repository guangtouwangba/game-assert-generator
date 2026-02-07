from __future__ import annotations

import base64

import httpx

from app.config import settings

OPENROUTER_API_URL = "https://api.openrouter.ai/api/v1/chat/completions"


class OpenRouterProvider:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate(
        self,
        prompt: str,
        model: str,
        ref_image_b64: str | None = None,
        aspect_ratio: str = "1:1",
        image_size: str = "1024x1024",
    ) -> bytes:
        """Generate an image using OpenRouter API.

        Args:
            prompt: Text description of the image to generate.
            model: Model identifier (e.g. "openai/gpt-image-1").
            ref_image_b64: Optional base64-encoded reference image.
            aspect_ratio: Desired aspect ratio (e.g. "1:1", "16:9").
            image_size: Desired pixel dimensions (e.g. "1024x1024").

        Returns:
            Raw image bytes decoded from the API response.

        Raises:
            httpx.HTTPStatusError: If the API returns a non-2xx status.
            ValueError: If no image is found in the response.
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        content_parts: list[dict] = []
        if ref_image_b64:
            clean_b64 = ref_image_b64
            if "," in clean_b64:
                clean_b64 = clean_b64.split(",", 1)[1]
            content_parts.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{clean_b64}"},
                }
            )
        content_parts.append({"type": "text", "text": prompt})

        payload = {
            "model": model,
            "messages": [{"role": "user", "content": content_parts}],
            "modalities": ["image", "text"],
            "image_config": {
                "aspect_ratio": aspect_ratio,
                "image_size": image_size,
            },
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                OPENROUTER_API_URL, json=payload, headers=headers
            )
            response.raise_for_status()
            data = response.json()

        message = data["choices"][0]["message"]

        # Try choices[0].message.images first (array of base64 strings)
        if "images" in message and message["images"]:
            return base64.b64decode(message["images"][0])

        # Fall back to content parts with embedded data URLs
        if isinstance(message.get("content"), list):
            for part in message["content"]:
                if part.get("type") == "image_url":
                    url = part["image_url"]["url"]
                    if url.startswith("data:"):
                        b64_data = url.split(",", 1)[1]
                        return base64.b64decode(b64_data)

        raise ValueError("No image found in OpenRouter response")

    def list_models(self) -> list[dict]:
        return [
            {"id": "openai/gpt-image-1", "name": "GPT Image 1", "provider": "openrouter"},
            {"id": "openai/dall-e-3", "name": "DALL-E 3", "provider": "openrouter"},
            {"id": "stability/stable-diffusion-3", "name": "Stable Diffusion 3", "provider": "openrouter"},
        ]


openrouter_provider = OpenRouterProvider(settings.OPENROUTER_API_KEY)
