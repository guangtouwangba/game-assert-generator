from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/game_asset_gen"
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    OUTPUT_DIR: str = "public/outputs"
    UPLOAD_DIR: str = "public/uploads"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def async_database_url(self) -> str:
        """Normalize DATABASE_URL for asyncpg.

        Zeabur/Neon provide postgres:// or postgresql:// URLs.
        SQLAlchemy asyncpg needs postgresql+asyncpg:// scheme.
        """
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    @property
    def output_path(self) -> Path:
        path = Path(self.OUTPUT_DIR)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        path.mkdir(parents=True, exist_ok=True)
        return path

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
