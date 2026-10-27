import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ProofHire AI Intelligence Service"
    VERSION: str = "0.2.0"
    API_V1_STR: str = "/api/v1"
    PORT: int = int(os.getenv("PORT", "8000"))
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB limit
    ALLOWED_EXTENSIONS: list[str] = [".pdf", ".docx", ".txt", ".json"]
    VERIFIED_CREDENTIAL_SCORE_BOOST: float = 15.0  # +15% boost for verified skills
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY", None)

settings = Settings()
