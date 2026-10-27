from typing import Any
from pydantic import BaseModel, Field

class EducationItem(BaseModel):
    institution: str | None = None
    degree: str | None = None
    fieldOfStudy: str | None = None
    graduationYear: int | None = None

class ExperienceItem(BaseModel):
    title: str | None = None
    company: str | None = None
    duration: str | None = None
    summary: str | None = None
    quantifiedMetrics: list[str] = Field(default_factory=list)

class ProjectItem(BaseModel):
    name: str | None = None
    technologies: list[str] = Field(default_factory=list)
    description: str | None = None

class ParsedResumeResponse(BaseModel):
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

class ResumeAnalyzeRequest(BaseModel):
    rawText: str
    targetRole: str | None = "Software Engineer"
    verifiedSkills: list[str] = Field(default_factory=list)

class RubricBreakdown(BaseModel):
    skillCoverageScore: int = Field(ge=0, le=25, description="Max 25 pts: Breadth and depth of technical/soft skills")
    experienceQualityScore: int = Field(ge=0, le=25, description="Max 25 pts: Descriptions and responsibilities")
    quantifiedImpactScore: int = Field(ge=0, le=25, description="Max 25 pts: Concrete metrics and numbers")
    formattingAndStructureScore: int = Field(ge=0, le=25, description="Max 25 pts: Clear headings and clarity")

class ResumeAnalyzeResponse(BaseModel):
    totalScore: int = Field(ge=0, le=100)
    rubric: RubricBreakdown
    extractedSkills: list[str]
    verifiedSkillsCount: int
    verifiedBoostApplied: float
    strengthHighlights: list[str]
    missingInformation: list[str]
    improvementSuggestions: list[str]
    scoringMethodology: str = "ProofHire Deterministic 100-Point Rubric v2.0"
