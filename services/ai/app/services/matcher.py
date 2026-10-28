import os
from app.schemas.jobs import (
    JobMatchRequest,
    JobMatchResponse,
    SkillEvidence,
    ComponentScores,
)

def match_candidate_to_job(req: JobMatchRequest) -> JobMatchResponse:
    """
    Computes an explainable, deterministic candidate-to-job match score.
    Features cryptographic boost (+15%) for skills validated by on-chain credentials.
    Adheres strictly to fairness constraints: ignores names, age, gender, and demographic markers.
    Optional LLM output is treated as supplementary advisory commentary only.
    """
    candidate_skills_lower = {s.lower().strip() for s in req.candidateSkills}
    verified_skills_lower = {v.lower().strip() for v in req.verifiedSkills}

    # 1. Evaluate Required Skills
    matched_required: list[str] = []
    missing_required: list[str] = []
    for r in req.requiredSkills:
        r_clean = r.strip()
        if r_clean.lower() in candidate_skills_lower:
            matched_required.append(r_clean)
        else:
            missing_required.append(r_clean)

    # 2. Evaluate Preferred Skills
    matched_preferred: list[str] = []
    missing_preferred: list[str] = []
    for p in req.preferredSkills:
        p_clean = p.strip()
        if p_clean.lower() in candidate_skills_lower:
            matched_preferred.append(p_clean)
        else:
            missing_preferred.append(p_clean)

    # Coverage ratios
    req_coverage = len(matched_required) / max(1, len(req.requiredSkills)) if req.requiredSkills else 1.0
    pref_coverage = len(matched_preferred) / max(1, len(req.preferredSkills)) if req.preferredSkills else 0.0

    # Component Calculations:
    # Required skills: up to 60 points
    required_score = req_coverage * 60.0

    # Preferred skills: up to 20 points
    preferred_score = pref_coverage * 20.0

    # Experience & Projects: up to 10 points
    projects_score = min(10.0, len(req.candidateProjects) * 5.0)

    # Experience duration alignment: up to 10 points
    exp_years = req.candidateExperienceYears or 0.0
    exp_score = min(10.0, exp_years * 3.33)

    base_score = required_score + preferred_score + projects_score + exp_score

    # 3. Cryptographic Verification Boost
    # Applied when matched required skills are anchored on-chain
    verified_matched = [s for s in matched_required if s.lower() in verified_skills_lower]
    verification_bonus = 0.0
    if verified_matched and len(matched_required) > 0:
        verified_ratio = len(verified_matched) / len(matched_required)
        verification_bonus = verified_ratio * 15.0

    final_score = min(100, int(round(base_score + verification_bonus)))

    # Evidence breakdown with clear reasoning
    evidence: list[SkillEvidence] = []
    for skill in matched_required:
        is_verified = skill.lower() in verified_skills_lower
        ev_type = "BLOCKCHAIN_CREDENTIAL" if is_verified else "SELF_REPORTED"
        reasoning = (
            "Cryptographically verified on Ethereum smart contract registry."
            if is_verified
            else "Extracted from candidate resume / documented skills list."
        )
        evidence.append(SkillEvidence(
            skill=skill,
            isVerified=is_verified,
            evidenceType=ev_type,
            reasoning=reasoning,
        ))

    for skill in matched_preferred:
        is_verified = skill.lower() in verified_skills_lower
        ev_type = "BLOCKCHAIN_CREDENTIAL" if is_verified else "SELF_REPORTED"
        reasoning = (
            "Cryptographically verified bonus competency."
            if is_verified
            else "Documented preferred qualification in candidate resume."
        )
        evidence.append(SkillEvidence(
            skill=skill,
            isVerified=is_verified,
            evidenceType=ev_type,
            reasoning=reasoning,
        ))

    for skill in missing_required:
        evidence.append(SkillEvidence(
            skill=skill,
            isVerified=False,
            evidenceType="MISSING_REQUIREMENT",
            reasoning="Required competency was not identified in candidate profile or credentials.",
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

    # Optional supplementary LLM commentary (simulated or API-grounded)
    supplementary_commentary = None
    if len(matched_required) >= len(req.requiredSkills) * 0.8:
        supplementary_commentary = (
            f"Strong candidate alignment for {req.jobTitle}. "
            f"Demonstrated core competence in {', '.join(matched_required[:3])}."
        )
    else:
        supplementary_commentary = (
            f"Partial match for {req.jobTitle}. "
            f"Candidate meets {len(matched_required)} requirements but would benefit from experience in {', '.join(missing_required[:2])}."
        )

    component_scores = ComponentScores(
        requiredSkillsScore=round(required_score, 1),
        preferredSkillsScore=round(preferred_score, 1),
        projectsScore=round(projects_score + exp_score, 1),
        cryptographicBonusScore=round(verification_bonus, 1),
    )

    return JobMatchResponse(
        overallMatchScore=final_score,
        componentScores=component_scores,
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
        supplementaryLlmCommentary=supplementary_commentary,
    )
