import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Log masked DATABASE_URL for debugging
    db_url = settings.async_database_url
    if "@" in db_url:
        masked = db_url.split("@")[0][:20] + "***@" + db_url.split("@")[1]
    else:
        masked = db_url[:30] + "***"
    logger.info(f"Connecting to database: {masked}")

    # Retry DB connection up to 10 times (cloud DB may need warm-up)
    max_retries = 10
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database connected and tables created.")
            break
        except Exception as e:
            if attempt == max_retries:
                logger.error(f"Failed to connect to database after {max_retries} attempts: {e}")
                raise
            wait = min(attempt * 2, 10)
            logger.warning(f"DB connection attempt {attempt}/{max_retries} failed: {e}. Retrying in {wait}s...")
            await asyncio.sleep(wait)

    yield
    await engine.dispose()


app = FastAPI(
    title="Game Asset Generator",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.router import api_router  # noqa: E402
from app.models.generation import Generation  # noqa: E402, F401

app.include_router(api_router, prefix="/api")
