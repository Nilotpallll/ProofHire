from fastapi import APIRouter
from app.schemas.jobs import JobMatchRequest, JobMatchResponse
from app.services.matcher import match_candidate_to_job

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/match", response_model=JobMatchResponse)
async def match_job_endpoint(req: JobMatchRequest):
    """
    Computes explainable candidate-to-job match score with verified credential bonus.
    """
    return match_candidate_to_job(req)
