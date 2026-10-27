# ProofHire — Developer & Agent Guide (AGENTS.md)

Welcome to the **ProofHire** repository. This document defines the engineering standards, architecture, operational workflows, and strict rules for all AI agents and software engineers contributing to the codebase.

---

## 1. Product Vision & Tagline

**Tagline:** *"Trust Skills. Verify Credentials. Hire Faster."*

ProofHire is an AI-powered decentralized academic and professional credential verification platform. It solves degree fraud, credential embellishment, and weeks-long background checking delays by uniting:
1. **Accredited Institutional Issuance** of verifiable cryptographic credentials on Ethereum and EVM-compatible networks.
2. **Student-Owned Sovereign Profiles** and portable credentials.
3. **AI Resume Parsing & Match Scoring** with cryptographic verification boosts.
4. **Recruiter Hiring Pipelines** with instant background verification and unverified claim audits.
5. **On-Chain Public Verification** and permanent revocation auditability.

---

## 2. Monorepo Architecture & Folder Responsibilities

```text
ProofHire/
├── apps/
│   └── web/              # Next.js App Router (React 19, TypeScript, Tailwind CSS, Lucide icons)
├── services/
│   ├── api/              # NestJS REST API (PostgreSQL, Prisma ORM, JWT Auth, Swagger OpenAPI, Ethers.js)
│   └── ai/               # FastAPI AI Microservice (Python 3.12/3.13, Pydantic, Uvicorn)
├── blockchain/           # Hardhat Ethereum contracts (Solidity 0.8.20, Ethers.js, OpenZeppelin)
├── packages/
│   ├── types/            # Shared TypeScript domain models, enums, DTOs
│   ├── config/           # Shared TypeScript and ESLint configurations
│   └── ui/               # Design tokens, color palette constants
├── docs/                 # Architectural Decision Records (ADRs) & documentation
│   ├── architecture/     # System overview, decisions, DB schema, accessibility
│   ├── api/              # REST OpenAPI and Swagger specs
│   ├── blockchain/       # Smart contract ABI, addresses, deployment guides
│   └── ai/               # Model weights, NLP extraction pipelines, scoring rubrics
└── docker/               # Container compose recipes for local orchestration
```

---

## 3. Strict Operating Rules for Agents

1. **Never Invent Features:** Do not report that a feature, test, or service is implemented unless the actual working code exists in the repository.
2. **Preserve Monorepo Integrity:** Do not overwrite existing working code merely to replace it with a different scaffold.
3. **Never Hardcode Secrets:** Keep private keys, database passwords, JWT secrets, and API tokens strictly inside `.env` files (never commit real secrets to Git).
4. **Role Boundary Enforcement:** Never allow a user to self-assign `ADMIN` role through public registration endpoints. All `INSTITUTION` registrations default to `PENDING_APPROVAL` status until vetted.
5. **No Fake Blockchain Truth:** Do not treat PostgreSQL as the sole source of blockchain truth. Public verification checks verify the cryptographic Keccak-256 hash against the Ethereum smart contract registry (`CredentialRegistry.sol`).
6. **Explicit Verification Taxonomy:** Always return explicit verification codes (`VERIFIED`, `REVOKED`, `DOCUMENT_MISMATCH`, `NOT_FOUND`, `ISSUER_INVALID`, `UNAVAILABLE`). Never collapse failure modes into a generic invalid error.

---

## 4. How to Run Each Service & Execute Test Suites

### Prerequisites
- Node.js: `v22.x LTS` (Current: v22.23.2)
- npm: `v10.x`
- Python: `3.12+` (Current: 3.13.2)
- PostgreSQL (for local database persistence)

### 1. Smart Contracts & Hardhat (`blockchain`)
```bash
# Compile contracts
npm run compile --workspace=@proofhire/blockchain

# Run unit test suite (23 passing tests)
npm run test --workspace=@proofhire/blockchain

# Deploy locally and export JSON configs
npx hardhat run scripts/deploy.ts --network hardhat --workspace=@proofhire/blockchain
```

### 2. NestJS Core API (`services/api`)
```bash
# Run unit tests
npm run test --workspace=@proofhire/api

# Start NestJS backend (Port 4000)
npm run start:dev --workspace=services/api
# Swagger docs at http://localhost:4000/api/docs
```

### 3. FastAPI AI Intelligence Service (`services/ai`)
```bash
cd services/ai
python -m venv .venv
# On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run AI unit tests
python -m unittest app/tests/test_ai_suite.py

# Run FastAPI server (Port 8000)
uvicorn app.main:app --reload --port 8000
# Interactive docs at http://localhost:8000/docs
```

### 4. Web Frontend (`apps/web`)
```bash
# Run Next.js frontend dev server (Port 3000)
npm run dev --workspace=apps/web

# Build production bundle
npm run build --workspace=apps/web
```

---

## 5. Demonstration Accounts

For local demonstration and pair programming, the system includes pre-configured seed credentials:

| Role | Email | Password | Primary Portal |
| :--- | :--- | :--- | :--- |
| **Student** | `student@proofhire.io` | `Student123!` | `/student/dashboard` |
| **Recruiter** | `recruiter@proofhire.io` | `Recruiter123!` | `/recruiter/dashboard` |
| **Institution** | `institution@proofhire.io` | `Institution123!` | `/institution/dashboard` |
| **SuperAdmin** | `admin@proofhire.io` | `Admin123!` | `/admin/dashboard` |

> Tip: The `/login` page features one-click demo login buttons for each role.

---

## 6. Coding & Accessibility Standards

- **TypeScript:** Strict type checking enabled (`strict: true`). No `any` used to bypass domain safety.
- **Accessibility:** Target WCAG 2.2 Level AA. Semantic HTML tags (`<nav>`, `<main role="main">`, `<header>`, `<aside>`), high-contrast text, visible `:focus-visible` rings, ARIA labels on icon buttons, keyboard navigable modals with `Escape` dismiss.
- **Design Tokens:** Deep ink navy (`#090D1A`), slate backgrounds (`#F8FAFC`), blue brand primary (`#2563EB`), verified emerald (`#10B981`), amber warnings (`#F59E0B`), and red errors (`#EF4444`).
