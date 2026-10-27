from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.schemas.resumes import ParsedResumeResponse, ResumeAnalyzeRequest, ResumeAnalyzeResponse
from app.services.parser import parse_resume_document
from app.services.analyzer import analyze_resume_text
from app.core.security import validate_file_size

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/parse", response_model=ParsedResumeResponse)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """
    Parses untrusted PDF, DOCX, or text resume uploads into structured candidate fields.
    """
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file must have a filename.")

    content = await file.read()
    validate_file_size(len(content))

    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

    parsed = parse_resume_document(content, file.filename)
    return parsed

@router.post("/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume_endpoint(req: ResumeAnalyzeRequest):
    """
    Evaluates raw resume text using a deterministic 100-point rubric with verified skill boosting.
    """
    if not req.rawText.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume text cannot be empty.")

    analysis = analyze_resume_text(req)
    return analysis
