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
    reasoning: str

class ComponentScores(BaseModel):
    requiredSkillsScore: float = Field(description="Contribution from required skill coverage (Max 65 pts)")
    preferredSkillsScore: float = Field(description="Contribution from preferred skill coverage (Max 25 pts)")
    projectsScore: float = Field(description="Contribution from demonstrated project experience (Max 10 pts)")
    cryptographicBonusScore: float = Field(description="Bonus from on-chain verified skills (Max 15 pts)")

class JobMatchResponse(BaseModel):
    overallMatchScore: int = Field(ge=0, le=100)
    componentScores: ComponentScores | None = None
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
    supplementaryLlmCommentary: str | None = None
    matchingMethodology: str = "ProofHire Deterministic Match Engine v2.2 with Cryptographic Boost"
    fairnessNotice: str = (
        "Ranking is based strictly on demonstrated skills, verified credentials, and project evidence. "
        "Protected characteristics (race, gender, age, religion, national origin, disability) are never evaluated."
    )
    employmentPredictionWarning: str = (
        "Match scores quantify keyword and credential alignment against explicit job requirements. "
        "They do not predict candidate competence, workplace capability, or on-the-job success."
    )
    humanDecisionSupportNotice: str = (
        "This assessment serves solely as decision support for human recruiters. "
        "ProofHire strictly prohibits automated rejection of candidates based on algorithmic scores."
    )
    protectedCharacteristicsIgnored: list[str] = [
        "Race", "Color", "Religion", "Sex", "National Origin", "Age", "Disability", "Genetic Information", "Sexual Orientation"
    ]
