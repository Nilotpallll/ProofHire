from app.schemas.jobs import JobMatchRequest, JobMatchResponse, SkillEvidence

def match_candidate_to_job(req: JobMatchRequest) -> JobMatchResponse:
    """
    Computes an explainable, deterministic candidate-to-job match score.
    Features cryptographic boost (+15%) for skills validated by on-chain credentials.
    Adheres strictly to fairness constraints: ignores names, age, and demographic markers.
    """
    candidate_skills_lower = {s.lower() for s in req.candidateSkills}
    verified_skills_lower = {v.lower() for v in req.verifiedSkills}

    matched_required: list[str] = []
    missing_required: list[str] = []
    for r in req.requiredSkills:
        if r.lower() in candidate_skills_lower:
            matched_required.append(r)
        else:
            missing_required.append(r)

    matched_preferred: list[str] = []
    missing_preferred: list[str] = []
    for p in req.preferredSkills:
        if p.lower() in candidate_skills_lower:
            matched_preferred.append(p)
        else:
            missing_preferred.append(p)

    req_coverage = len(matched_required) / max(1, len(req.requiredSkills))
    pref_coverage = len(matched_preferred) / max(1, len(req.preferredSkills))

    # Base match calculation: 65% required, 25% preferred, 10% projects baseline
    base_score = (req_coverage * 65.0) + (pref_coverage * 25.0) + (min(1.0, len(req.candidateProjects) * 0.5) * 10.0)

    # Cryptographic Verification Boost (+15% when required skills are backed by on-chain credentials)
    verified_matched = [s for s in matched_required if s.lower() in verified_skills_lower]
    verification_bonus = 0.0
    if verified_matched and len(matched_required) > 0:
        verified_ratio = len(verified_matched) / len(matched_required)
        verification_bonus = verified_ratio * 15.0

    final_score = min(100, int(round(base_score + verification_bonus)))

    # Evidence breakdown
    evidence: list[SkillEvidence] = []
    for skill in matched_required + matched_preferred:
        is_verified = skill.lower() in verified_skills_lower
        ev_type = "BLOCKCHAIN_CREDENTIAL" if is_verified else "SELF_REPORTED"
        evidence.append(SkillEvidence(
            skill=skill,
            isVerified=is_verified,
            evidenceType=ev_type
        ))

    # Construct explainable rationale
    explanation_parts = [
        f"Candidate satisfies {len(matched_required)} of {len(req.requiredSkills)} required skills ({req_coverage * 100:.0f}% coverage)."
    ]
    if verified_matched:
        explanation_parts.append(
            f"Candidate earned a +{verification_bonus:.1f}% confidence boost because {len(verified_matched)} core skill(s) ({', '.join(verified_matched)}) are verified by tamper-proof on-chain university credentials."
        )
    if missing_required:
        explanation_parts.append(f"Gaps identified in required skills: {', '.join(missing_required)}.")
    if matched_preferred:
        explanation_parts.append(f"Bonus alignment on preferred competencies: {', '.join(matched_preferred)}.")

    explanation = " ".join(explanation_parts)

    return JobMatchResponse(
        overallMatchScore=final_score,
        requiredSkillsCoverage=round(req_coverage, 2),
        preferredSkillsCoverage=round(pref_coverage, 2),
        matchedRequiredSkills=matched_required,
        missingRequiredSkills=missing_required,
        matchedPreferredSkills=matched_preferred,
        missingPreferredSkills=missing_preferred,
        verifiedSkillsMatched=verified_matched,
        verificationBonusPercentage=round(verification_bonus, 1),
        skillEvidenceBreakdown=evidence,
        explanation=explanation,
    )
