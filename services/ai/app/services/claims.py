from app.schemas.claims import (
    ClaimsCheckRequest,
    ClaimsCheckResponse,
    ClaimStatus,
    ClaimVerificationResult,
    OnChainEvidence,
)

def evaluate_claims(req: ClaimsCheckRequest) -> ClaimsCheckResponse:
    """
    Evaluates individual resume claims against cryptographic on-chain evidence.
    Classifies each claim with precision into VERIFIED, REVOKED, MISMATCH, UNVERIFIED, or NOT_PROVIDED.
    Adheres strictly to fairness: absence of a blockchain credential does not label a candidate fraudulent.
    """
    evidence_map: dict[str, OnChainEvidence] = {
        e.credentialId.lower(): e for e in req.availableEvidence
    }

    results: list[ClaimVerificationResult] = []
    verified_count = 0
    unverified_count = 0
    revoked_count = 0
    mismatch_count = 0

    for claim in req.claims:
        # Case 1: No credential ID provided
        if not claim.credentialId:
            results.append(ClaimVerificationResult(
                claimText=claim.claimText,
                status=ClaimStatus.NOT_PROVIDED,
                reason="No verifiable credential identifier was supplied with this claim.",
                evidenceDetails=None,
                recommendation="Candidate can optionally request on-chain credential from issuing institution to prove authenticity.",
            ))
            unverified_count += 1
            continue

        cred_key = claim.credentialId.lower()
        evidence = evidence_map.get(cred_key)

        # Case 2: Credential not found on-chain
        if not evidence or not evidence.exists:
            results.append(ClaimVerificationResult(
                claimText=claim.claimText,
                status=ClaimStatus.UNVERIFIED,
                reason=f"Credential identifier '{claim.credentialId}' was not located in the smart contract registry.",
                evidenceDetails="Registry query returned exists=false.",
                recommendation="Verify credential ID spelling or confirm whether issuer has anchored issuance to the blockchain.",
            ))
            unverified_count += 1
            continue

        # Case 3: Credential is on-chain but REVOKED
        if evidence.isRevoked:
            results.append(ClaimVerificationResult(
                claimText=claim.claimText,
                status=ClaimStatus.REVOKED,
                reason=f"Credential '{claim.credentialId}' was formally revoked by the issuing institution ({evidence.issuerName or 'Unknown Issuer'}).",
                evidenceDetails="Registry query confirmed isRevoked=true with on-chain revocation event.",
                recommendation="Review revocation reason with candidate. Credential is invalid for employment qualification.",
            ))
            revoked_count += 1
            continue

        # Case 4: Document digest mismatch
        if claim.documentHash and evidence.onChainDigest:
            if claim.documentHash.lower() != evidence.onChainDigest.lower():
                results.append(ClaimVerificationResult(
                    claimText=claim.claimText,
                    status=ClaimStatus.MISMATCH,
                    reason="The cryptographic digest of the submitted document does not match the on-chain recorded Keccak-256 digest.",
                    evidenceDetails=f"Submitted digest: {claim.documentHash[:12]}... vs On-chain: {evidence.onChainDigest[:12]}...",
                    recommendation="Re-upload original unaltered certificate PDF from the university portal.",
                ))
                mismatch_count += 1
                continue

        # Case 5: Verified valid credential
        if evidence.isValid:
            results.append(ClaimVerificationResult(
                claimText=claim.claimText,
                status=ClaimStatus.VERIFIED,
                reason=f"Cryptographically verified on-chain by accredited issuer: {evidence.issuerName or 'Authorized University'}.",
                evidenceDetails=f"Contract: {evidence.issuer[:10]}... | Status: ACTIVE",
                recommendation="Highest confidence level. Zero additional background verification needed.",
            ))
            verified_count += 1
            continue

        # Fallback: Review required
        results.append(ClaimVerificationResult(
            claimText=claim.claimText,
            status=ClaimStatus.REVIEW_REQUIRED,
            reason="Credential exists on-chain but issuer status is pending governance re-certification.",
            evidenceDetails="Issuer authorization suspended or under review.",
            recommendation="Perform standard institutional confirmation.",
        ))

    return ClaimsCheckResponse(
        totalClaimsChecked=len(req.claims),
        verifiedCount=verified_count,
        unverifiedCount=unverified_count,
        revokedCount=revoked_count,
        mismatchCount=mismatch_count,
        results=results,
    )
