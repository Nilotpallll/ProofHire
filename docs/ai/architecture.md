# ProofHire AI Intelligence Microservice Architecture

## 1. Architectural Philosophy & Ethical Standards

The ProofHire AI Intelligence microservice (`services/ai`) is designed for **explainability, determinism, and bias mitigation**.

### Core Guarantees:
1. **Decision Support, Not Automated Decisions**: The AI engine scores and matches candidates to assist human recruiters. It never makes automatic rejection or hiring decisions.
2. **Protected Characteristic Exclusion**: Demographic attributes (names, gender, race, religion, caste, national origin, photos) are **never** utilized as ranking signals or match inputs.
3. **Deterministic Baseline**: All scoring rules for skill coverage, experience years, and quantified metrics follow a published, testable mathematical rubric.
4. **Resilient Offline Operation**: The service operates with high performance using zero-dependency local heuristics and does not require paid external LLM subscriptions to function.

---

## 2. Directory Layout

```text
services/ai/
├── app/
│   ├── main.py                     # FastAPI application setup, middleware, lifecycle
│   ├── core/
│   │   ├── config.py               # Pydantic Settings & environment variables
│   │   └── security.py             # File size limits, sanitize inputs, anti-prompt injection
│   ├── schemas/
│   │   ├── resumes.py              # Pydantic schemas for parse & analyze requests/responses
│   │   ├── jobs.py                 # Pydantic schemas for candidate-job matching
│   │   └── claims.py               # Pydantic schemas for unverified claim auditing
│   ├── services/
│   │   ├── parser.py               # PDF and DOCX text extraction
│   │   ├── analyzer.py             # Deterministic 100-point rubric and feedback engine
│   │   ├── matcher.py              # Explainable job-candidate matching engine
│   │   └── claims.py               # Multi-factor claim verification engine
│   ├── api/v1/
│   │   ├── resumes.py              # POST /api/v1/resumes/parse & /analyze
│   │   ├── jobs.py                 # POST /api/v1/jobs/match
│   │   └── claims.py               # POST /api/v1/claims/check
│   └── tests/
│       └── test_ai_suite.py        # Python unittest suite
├── requirements.txt
└── Dockerfile
```

---

## 3. Endpoints & API Contract

### Health & Readiness
- `GET /health`: Returns service status and active AI model identifier (`proofhire-nlp-rules-v2`).
- `GET /ready`: Returns readiness and memory consumption.

### Resume Intelligence
- `POST /api/v1/resumes/parse`: Extracts structured text, candidate skills, experience years, and education from PDF/DOCX uploads without executing untrusted macros or JavaScript.
- `POST /api/v1/resumes/analyze`: Evaluates parsed resume content against the deterministic 100-point rubric, returning category scores and actionable feedback.

### Candidate-Job Matching
- `POST /api/v1/jobs/match`: Computes deterministic skill overlap, missing skills, experience qualification, and transparent scoring weights.

### Claim Audit & Fraud Prevention
- `POST /api/v1/claims/check`: Cross-references resume claims (education, certifications, prior titles) against on-chain credential databases and registered document digests.
