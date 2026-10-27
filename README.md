# ProofHire

> **"Trust Skills. Verify Credentials. Hire Faster."**

ProofHire is an AI-powered decentralized academic and professional credential verification and recruitment platform. It eliminates fake degrees, reduces background check delays from 2 weeks to sub-second verification, and empowers students with sovereign, portable credentials.

---

## Architecture At A Glance

- **Frontend (`apps/web`)**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Backend API (`services/api`)**: NestJS, TypeScript, Prisma ORM, PostgreSQL, Passport JWT, Swagger OpenAPI on Port 4000.
- **AI Service (`services/ai`)**: Python 3.12+ FastAPI, Pydantic, Uvicorn on Port 8000. Modular intelligence suite with deterministic 100-point resume rubric, candidate-job matching, and unverified claim detection.
- **Blockchain (`blockchain`)**: Solidity 0.8.20 Smart Contracts on Hardhat (`CredentialRegistry.sol`) with Polygon Amoy and Sepolia EVM support.
- **Packages**: Shared domain types (`@proofhire/types`), base configuration (`@proofhire/config`), and design tokens (`@proofhire/ui`).

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
- **Student Portal** (`/student/dashboard`): Manage on-chain verified credentials, AI resume scores (100-point rubric with verified skill boosts), job applications, and public portfolio.
- **Recruiter Portal** (`/recruiter/dashboard`): Post job requisitions, search candidates, and run multi-factor unverified claim verification audits.
- **Institution Portal** (`/institution/dashboard`): Issue verified diplomas/certificates on-chain with live SHA-256 document hashing, manage student cohorts, and enforce revocations.
- **Admin Portal** (`/admin/dashboard`): Institutional accreditation approvals, user management, and security audit logs.
- **Public Verification** (`/verify/[credentialId]`): Instant, zero-sign-in public verification of cryptographic authenticity with client-side document digest matching.

---

## Seed Demonstration Logins

Access `/login` and select any 1-click demo persona:
- **Student:** `student@proofhire.io` (Password: `Student123!`)
- **Recruiter:** `recruiter@proofhire.io` (Password: `Recruiter123!`)
- **Institution:** `institution@proofhire.io` (Password: `Institution123!`)
- **Admin:** `admin@proofhire.io` (Password: `Admin123!`)

---

## Documentation

### System & Architecture
- [System Architecture](docs/architecture/system-overview.md)
- [Architectural Decisions (ADR)](docs/architecture/decisions.md)
- [Database Schema & Prisma Design](docs/architecture/database-design.md)
- [Accessibility Compliance (WCAG 2.2 AA)](docs/architecture/accessibility.md)

### Blockchain & Smart Contracts (Phase 2)
- [Smart Contract Design](docs/blockchain/contract-design.md)
- [Deployment & Network Guide](docs/blockchain/deployment.md)
- [Verification Flow & Taxonomy](docs/blockchain/verification-flow.md)

### AI Intelligence (Phase 2)
- [AI Service Architecture](docs/ai/architecture.md)
- [Resume Scoring Rubric](docs/ai/resume-analysis.md)
- [Candidate-Job Matching Methodology](docs/ai/matching-methodology.md)

### API & Endpoints
- [API Overview & Swagger Specs](docs/api/api-overview.md)
- [Credential REST Endpoints](docs/api/credential-endpoints.md)
