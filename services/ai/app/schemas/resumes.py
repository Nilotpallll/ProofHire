from typing import Any
from pydantic import BaseModel, Field

class EducationItem(BaseModel):
    institution: str | None = None
    degree: str | None = None
    fieldOfStudy: str | None = None
    graduationYear: int | None = None
    evidenceSource: str = "EXTRACTED_FROM_DOCUMENT"

class ExperienceItem(BaseModel):
    title: str | None = None
    company: str | None = None
    duration: str | None = None
    summary: str | None = None
    quantifiedMetrics: list[str] = Field(default_factory=list)
    evidenceSource: str = "EXTRACTED_FROM_DOCUMENT"

class ProjectItem(BaseModel):
    name: str | None = None
    technologies: list[str] = Field(default_factory=list)
    description: str | None = None
    evidenceSource: str = "EXTRACTED_FROM_DOCUMENT"

class ExtractedFacts(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: list[str] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    links: list[str] = Field(default_factory=list)

class ParsedResumeResponse(BaseModel):
    extractionStatus: str = Field(
        default="SUCCESS",
        description="SUCCESS, PARTIAL, SCANNED_OR_UNREADABLE, or FAILED"
    )
    isTextExtractable: bool = True
    extractionMethod: str = "Deterministic RegEx & Semantic Section Parser (Zero-Hallucination)"
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: list[str] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    links: list[str] = Field(default_factory=list)
    rawTextExcerpt: str | None = None
    extractionConfidence: float = Field(default=0.85, ge=0.0, le=1.0)
    fileFormat: str
    extractedFacts: ExtractedFacts | None = None
    inferredSuggestions: list[str] = Field(default_factory=list)
    missingSections: list[str] = Field(default_factory=list)
    failureReason: str | None = None

class ResumeAnalyzeRequest(BaseModel):
    rawText: str
    targetRole: str | None = "Software Engineer"
    verifiedSkills: list[str] = Field(default_factory=list)

class RubricBreakdown(BaseModel):
    skillCoverageScore: int = Field(ge=0, le=25, description="Max 25 pts: Breadth and depth of technical skills verified present in text")
    experienceQualityScore: int = Field(ge=0, le=25, description="Max 25 pts: Descriptions, responsibilities, and action verbs")
    quantifiedImpactScore: int = Field(ge=0, le=25, description="Max 25 pts: Concrete metrics, scale, and numbers")
    formattingAndStructureScore: int = Field(ge=0, le=25, description="Max 25 pts: Contact info, clear sections, and presentation clarity")

class ResumeAnalyzeResponse(BaseModel):
    totalScore: int = Field(ge=0, le=100)
    rubric: RubricBreakdown
    extractedSkills: list[str]
    verifiedSkillsCount: int
    verifiedBoostApplied: float
    strengthHighlights: list[str]
    missingInformation: list[str]
    improvementSuggestions: list[str]
    scoringMethodology: str = "ProofHire Deterministic 100-Point Rubric v2.2"
    scoringExplanation: str = (
        "Total score is calculated deterministically from four 25-point rubric components: "
        "Skill Coverage (0-25), Experience Quality (0-25), Quantified Impact (0-25), and "
        "Formatting & Structure (0-25), plus a transparent on-chain credential boost (up to +12 pts, capped at 100)."
    )
    uncertaintyLevel: str = Field(default="LOW", description="LOW, MEDIUM, or HIGH based on document completeness")
    employmentPredictionWarning: str = (
        "This score measures resume structure, keyword completeness, and cryptographic attestation only. "
        "It does NOT predict job performance, candidate competence, or employment success."
    )
    humanDecisionSupportNotice: str = (
        "ProofHire AI results are advisory decision support for human reviewers. "
        "Automated candidate rejection based solely on algorithmic scores is strictly prohibited."
    )
