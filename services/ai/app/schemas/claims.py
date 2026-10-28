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
    evidenceTier: str = Field(default="CRYPTOGRAPHIC_CONSENSUS", description="CRYPTOGRAPHIC_CONSENSUS or MANUAL_REVIEW_RECOMMENDED")
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
    legalDisclaimer: str = (
        "Absence of a blockchain credential does not constitute evidence of fraud, embellishment, or dishonesty. "
        "Many accredited institutions have not yet digitized credential registries on-chain. "
        "Unverified claims indicate missing cryptographic proof, requiring standard offline confirmation."
    )
    cryptographicAuthorityNotice: str = (
        "ProofHire smart contract registry state is the sole authoritative proof of blockchain verification. "
        "AI and language models never determine or override on-chain cryptographic truth."
    )
