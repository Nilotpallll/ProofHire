# Explainable Candidate-Job Matching Methodology

## 1. Mathematical Matching Formula

ProofHire calculates candidate-job alignment using a transparent, weighted formula:

$$\text{MatchScore} = (W_{\text{req}} \times S_{\text{req}}) + (W_{\text{pref}} \times S_{\text{pref}}) + (W_{\text{exp}} \times S_{\text{exp}}) + \text{Bonus}_{\text{verified}}$$

### Standard Weights:
- **Required Skill Coverage ($W_{\text{req}} = 0.50$ / 50%)**:
  $$S_{\text{req}} = \frac{|\text{CandidateSkills} \cap \text{JobRequiredSkills}|}{|\text{JobRequiredSkills}|}$$
- **Preferred Skill Coverage ($W_{\text{pref}} = 0.20$ / 20%)**:
  $$S_{\text{pref}} = \frac{|\text{CandidateSkills} \cap \text{JobPreferredSkills}|}{|\text{JobPreferredSkills}|}$$
- **Experience Requirement Alignment ($W_{\text{exp}} = 0.15$ / 15%)**:
  $$S_{\text{exp}} = \min\left(1.0, \frac{\text{CandidateYears}}{\text{JobRequiredYears}}\right)$$
- **Cryptographic Verification Boost ($\text{Bonus}_{\text{verified}} = 0.15$ / 15%)**:
  Awarded when candidate skills match institutional credentials verified against `CredentialRegistry.sol`.

---

## 2. Match Transparency & Output Schema

The matching endpoint (`POST /api/v1/jobs/match`) returns granular diagnostic breakdown so recruiters and candidates understand exactly why a match percentage was assigned:

```json
{
  "match_score": 88,
  "methodology": "deterministic_v2_weighted",
  "breakdown": {
    "required_skills_coverage": 0.85,
    "preferred_skills_coverage": 0.75,
    "experience_alignment": 1.0,
    "verified_credential_boost": 12
  },
  "matched_required_skills": ["TypeScript", "React", "PostgreSQL", "Solidity"],
  "missing_required_skills": ["Docker"],
  "matched_preferred_skills": ["Tailwind CSS", "Next.js"],
  "explanation": "Candidate fulfills 4 of 5 required technical skills (80%) and has 3 verified academic/certification credentials anchoring Solidity and Web Development expertise. Missing Docker requirement."
}
```

---

## 3. Fair Hiring & Anti-Bias Commitments

ProofHire adheres to strict ethical AI standards for employment technologies:
- **No Demographics in Ranking**: Age, graduation dates, zip codes, gender indicators, photographs, and school prestige tiers are omitted from the matching function.
- **Deterministic Reproducibility**: Given the same resume text and job description, the score is identical across all runs.
- **Human Recruiter in the Loop**: AI match percentages serve as sortable screening filters, never automated qualification gates.
