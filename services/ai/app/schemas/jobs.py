from pydantic import BaseModel, Field

class JobMatchRequest(BaseModel):
    candidateSkills: list[str] = Field(default_factory=list)
    candidateProjects: list[str] = Field(default_factory=list)
    candidateExperienceYears: float | None = 2.0
    requiredSkills: list[str] = Field(default_factory=list)
    preferredSkills: list[str] = Field(default_factory=list)
    jobTitle: str = "Software Engineer"
    jobDescription: str | None = None
    verifiedSkills: list[str] = Field(default_factory=list, description="Skills cryptographically anchored to on-chain credentials")

class SkillEvidence(BaseModel):
    skill: str
    isVerified: bool
    evidenceType: str  # "BLOCKCHAIN_CREDENTIAL", "PROJECT_MATCH", "SELF_REPORTED"

class JobMatchResponse(BaseModel):
    overallMatchScore: int = Field(ge=0, le=100)
    requiredSkillsCoverage: float = Field(ge=0.0, le=1.0)
    preferredSkillsCoverage: float = Field(ge=0.0, le=1.0)
    matchedRequiredSkills: list[str]
    missingRequiredSkills: list[str]
    matchedPreferredSkills: list[str]
    missingPreferredSkills: list[str]
    verifiedSkillsMatched: list[str]
    verificationBonusPercentage: float
    skillEvidenceBreakdown: list[SkillEvidence]
    explanation: str
    matchingMethodology: str = "ProofHire Explainable Match Engine v2.1 with Cryptographic Boost"
    fairnessNotice: str = "Ranking is based strictly on demonstrated skills, verified credentials, and project evidence. Protected characteristics are never evaluated."
