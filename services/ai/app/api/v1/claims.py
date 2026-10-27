from fastapi import APIRouter
from app.schemas.claims import ClaimsCheckRequest, ClaimsCheckResponse
from app.services.claims import evaluate_claims

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.post("/check", response_model=ClaimsCheckResponse)
async def check_claims_endpoint(req: ClaimsCheckRequest):
    """
    Evaluates resume claims against verified blockchain evidence.
    """
    return evaluate_claims(req)
