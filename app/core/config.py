from pydantic_settings import BaseSettings

from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    EXCHANGE_RATE_API: str = "https://api.frankfurter.dev/v1/latest"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
