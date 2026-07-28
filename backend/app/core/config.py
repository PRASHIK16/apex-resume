from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "dev-secret"
    DATABASE_URL: str = "sqlite+aiosqlite:///./apex_dev.db"
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    CLERK_SECRET_KEY: str = ""
    CLERK_JWT_PUBLIC_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    REDIS_URL: str = "redis://localhost:6379"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()