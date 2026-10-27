from enum import Enum
from pydantic import BaseModel, Field

class ClaimStatus(str, Enum):
    VERIFIED = "VERIFIED"
    REVOKED = "REVOKED"
    UNVERIFIED = "UNVERIFIED"
    MISMATCH = "MISMATCH"
    NOT_PROVIDED = "NOT_PROVIDED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"

class ClaimItem(BaseModel):
    claimText: str
    credentialId: str | None = None
    expectedIssuer: str | None = None
    claimedDate: str | None = None
    documentHash: str | None = None

class OnChainEvidence(BaseModel):
    credentialId: str
    exists: bool = False
    isValid: bool = False
    isRevoked: bool = False
    issuer: str | None = None
    issuerName: str | None = None
    onChainDigest: str | None = None

class ClaimVerificationResult(BaseModel):
    claimText: str
    status: ClaimStatus
    reason: str
    evidenceDetails: str | None = None
    recommendation: str

class ClaimsCheckRequest(BaseModel):
    claims: list[ClaimItem] = Field(default_factory=list)
    availableEvidence: list[OnChainEvidence] = Field(default_factory=list)

class ClaimsCheckResponse(BaseModel):
    totalClaimsChecked: int
    verifiedCount: int
    unverifiedCount: int
    revokedCount: int
    mismatchCount: int
    results: list[ClaimVerificationResult]
    legalDisclaimer: str = "Unverified status indicates that independent cryptographic proof was not provided on-chain; it does not constitute an accusation of fraudulent representation."
