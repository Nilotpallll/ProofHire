import re
from fastapi import HTTPException, status
from app.core.config import settings

def validate_file_size(size_bytes: int):
    if size_bytes > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024):.1f}MB",
        )

def sanitize_extracted_text(text: str) -> str:
    """
    Sanitizes extracted document text to prevent prompt injection or null-byte poisoning.
    Removes control characters while preserving standard formatting whitespace.
    """
    if not text:
        return ""
    # Strip null bytes and non-printable control characters except newline and tab
    clean = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
    # Neutralize prompt injection attempts like system override instructions
    clean = re.sub(
        r"(?i)(ignore previous instructions|disregard all prior directives|you are now in developer mode)",
        "[FILTERED_POTENTIAL_INJECTION]",
        clean,
    )
    return clean.strip()
