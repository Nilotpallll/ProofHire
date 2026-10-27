# ProofHire

> **"Trust Skills. Verify Credentials. Hire Faster."**

ProofHire is an AI-powered decentralized academic and professional credential verification and recruitment platform. It eliminates fake degrees, reduces background check delays from 2 weeks to sub-second verification, and empowers students with sovereign, portable credentials.

---

## Architecture At A Glance

- **Frontend (`apps/web`)**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Backend API (`services/api`)**: NestJS, TypeScript, Prisma ORM, PostgreSQL, Passport JWT, Swagger OpenAPI on Port 4000. Full lifecycle for jobs, applications, credentials, and administration.
- **AI Service (`services/ai`)**: Python 3.12+ FastAPI, Pydantic, Uvicorn on Port 8000. Modular intelligence suite with deterministic 100-point resume rubric, candidate-job matching, and unverified claim detection.
- **Blockchain (`blockchain`)**: Solidity 0.8.20 Smart Contracts on Hardhat (`CredentialRegistry.sol`) with Polygon Amoy and Sepolia EVM support.
- **Packages**: Shared domain types (`@proofhire/types`), base configuration (`@proofhire/config`), and design tokens (`@proofhire/ui`).

---

## End-to-End Recruitment Scenario

ProofHire supports a complete 20-step verification and recruitment lifecycle:
1. **Institution Login**: Authorized academic institution logs in (`institution@proofhire.io`).
2. **Student Selection**: Institution selects candidate student (`Alex Rivera`).
3. **Certificate Upload**: Uploads original PDF degree certificate.
4. **Digest Calculation**: ProofHire calculates the SHA-256 / Keccak-256 byte digest.
5. **Secure Storage**: Document stored via private storage adapter (no plaintext PII on public IPFS).
6. **Credential Issuance**: Institution signs issuance transaction.
7. **Blockchain Confirmation**: Smart contract emits `CredentialIssued` on Hardhat / Polygon.
8. **Student Portal Visibility**: Student sees verified credential in their sovereign portfolio.
9. **Resume Upload**: Student uploads resume (PDF/DOCX).
10. **AI Resume Intelligence**: ProofHire parses, sanitizes, and scores resume against deterministic 100-point rubric.
11. **Profile Improvement**: Student reviews prioritized gaps and profile improvements.
12. **Job Requisition Creation**: Recruiter posts open position with required and preferred skills.
13. **Job Application**: Student applies with attached cryptographic proofs.
14. **Application Review**: Recruiter inspects incoming candidate pipeline.
15. **AI Fit Evaluation**: AI calculates explainable match score with +15% verified credential boost.
16. **Explanation Review**: Recruiter examines required skill coverage and missing competencies.
17. **On-Chain Verification**: Recruiter checks blockchain status and confirms byte-level digest equality.
18. **Pipeline Advancement**: Recruiter shortlists, adds review notes, or advances to interview.
19. **Student Status Update**: Student observes live stage progression in real-time.
20. **Revocation Auditing**: If an institution revokes a credential, public verification instantly reflects `REVOKED` status with recorded reason and timestamp.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile & Test Smart Contracts
```bash
npm run compile --workspace=@proofhire/blockchain
npm run test --workspace=@proofhire/blockchain
# Deploy to local Hardhat node & export artifacts:
npx hardhat run scripts/deploy.ts --network hardhat --workspace=@proofhire/blockchain
```

### 3. Run Applications Locally
```bash
# Run Next.js Web Frontend (Port 3000)
npm run dev:web

# Run NestJS API (Port 4000)
npm run dev:api

# Run AI Intelligence Service (Port 8000)
cd services/ai
python -m venv .venv
# On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Multi-Role Portals & Workflows

ProofHire provides dedicated portals across 4 key roles:
- **Student Portal** (`/student/dashboard`): Manage on-chain verified credentials, AI resume scores (100-point rubric with verified skill boosts), discover jobs, apply with proofs, and track stage progress.
- **Recruiter Portal** (`/recruiter/dashboard`): Post job requisitions, toggle job statuses (Open/Closed), inspect applicant pipeline, review explainable AI matching scores, verify credentials on-chain, and record internal notes.
- **Institution Portal** (`/institution/dashboard`): Issue verified diplomas/certificates on-chain with live SHA-256 document hashing, manage student cohorts, and enforce revocations with audit confirmation.
- **Admin Portal** (`/admin/dashboard`): Authorize and suspend institutions, manage user access, inspect immutable security audit trails, and monitor platform health metrics.
- **Public Verification** (`/verify/[credentialId]`): Instant, zero-sign-in public verification of cryptographic authenticity with client-side document digest matching.
- **Public Digital Passport** (`/u/[username]`): Differentiated skill taxonomy (Institutionally Verified vs. Resume Extracted vs. Self-Declared) with zero private data exposure.

---

## Seed Demonstration Logins

Access `/login` and select any 1-click demo persona:
- **Student:** `student@proofhire.io` (Password: `Student123!`)
- **Recruiter:** `recruiter@proofhire.io` (Password: `Recruiter123!`)
- **Institution:** `institution@proofhire.io` (Password: `Institution123!`)
- **Admin:** `admin@proofhire.io` (Password: `Admin123!`)

---

## Test Suites Execution

```bash
# 1. Smart Contracts Unit Tests (23 tests)
npm run test --workspace=@proofhire/blockchain

# 2. Backend NestJS Unit Tests (20 tests)
npm run test --workspace=@proofhire/api

# 3. AI Service Tests (5 tests)
cd services/ai && python -m unittest app/tests/test_ai_suite.py

# 4. Frontend Type-Check & Production Build (32 routes)
npx tsc --noEmit --project apps/web/tsconfig.json
npm run build --workspace=@proofhire/web
```

---

## Comprehensive Documentation Index

### System & Architecture
- [System Architecture](docs/architecture/system-overview.md)
- [Architectural Decisions (ADR)](docs/architecture/decisions.md)
- [Database Schema & Prisma Design](docs/architecture/database-design.md)
- [Accessibility Compliance (WCAG 2.2 AA)](docs/architecture/accessibility.md)

### Blockchain & Smart Contracts
- [Smart Contract Design](docs/blockchain/contract-design.md)
- [Deployment & Network Guide](docs/blockchain/deployment.md)
- [Verification Flow & Status Taxonomy](docs/blockchain/verification-flow.md)

### AI Intelligence & Fairness
- [AI Service Architecture](docs/ai/architecture.md)
- [Resume Scoring Rubric (100-Point Scale)](docs/ai/resume-analysis.md)
- [Candidate-Job Matching Methodology](docs/ai/matching-methodology.md)

### Security & Governance
- [Threat Model & STRIDE Analysis](docs/security/threat-model.md)
- [Security Review & Checklist](docs/security/security-review.md)

### Demonstration & Deployment
- [5-to-7 Minute Demo Script](docs/demo/demo-script.md)
- [Test Accounts & Seed Personas](docs/demo/test-accounts.md)
- [Cloud Deployment & Operations Guide](docs/deployment/deployment-guide.md)
- [REST API Endpoints Specification](docs/api/credential-endpoints.md)
