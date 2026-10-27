from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.resumes import router as resumes_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.claims import router as claims_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ProofHire AI Intelligence Service providing resume parsing, 100-point rubric scoring, explainable candidate matching, and on-chain credential claim verification.",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(resumes_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(claims_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {
        "ready": True,
        "engine": "Deterministic + Cryptographic Boost v2.1",
        "supported_formats": settings.ALLOWED_EXTENSIONS,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
