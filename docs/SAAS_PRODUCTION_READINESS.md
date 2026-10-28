# ProofHire — Production Readiness & SaaS Architecture Guide

This document defines how **ProofHire** operates as both an academic course project and a production-ready, deployable Software-as-a-Service (SaaS) application for cryptographic credential verification and recruitment.

---

## 1. System Architecture Overview

```
                      +-----------------------------+
                      |     Next.js Web Client      |
                      |   (Port 3000, App Router)   |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v (REST / JSON)                             v (Direct AI / Multipart)
+-----------------------------+             +-----------------------------+
|    NestJS Core REST API     | <---------> |    FastAPI AI Microservice  |
|    (Port 4000, RBAC & Auth) |             |    (Port 8000, 100-pt Rubric)|
+--------------+--------------+             +-----------------------------+
               |
      +--------+--------+
      |                 |
      v                 v
+------------+   +-----------------------------+
| PostgreSQL |   |  EVM Smart Contract Registry|
| (Prisma DB)|   |  (Port 8545 / Sepolia / L2) |
+------------+   +-----------------------------+
```

---

## 2. Multi-Role RBAC & Lifecycle Architecture

### A. Student Persona
- **Self-Registration:** Immediate access (`status: ACTIVE`).
- **Profile Management:** Public portfolio page (`/u/[username]`), customizable bio, education history, and social links.
- **AI Resume Intelligence:** Upload digital PDF/DOCX or paste text; deterministic 100-point rubric breakdown with ethical decision support notices (no automated algorithmic rejections).
- **Credentials Portfolio:** Displays only credentials issued to the authenticated student's email/ID. Clean empty state with issuance instructions for new candidates.
- **Job Applications:** Direct applications with attached cryptographic proof counts. Duplicate submission guard (`409 Conflict`). Application withdrawal with audit trails.

### B. Accredited Institution Persona
- **Vetted Registration:** Registrations default to `status: PENDING_APPROVAL`.
- **Administrative Governance:** Institution cannot sign in or issue credentials until approved by platform governance.
- **On-Chain Issuance:** Once approved (`status: ACTIVE`), institutions issue credentials directly anchoring Keccak-256 document digests, recipient identifiers, and IPFS metadata to the `CredentialRegistry.sol` smart contract.
- **Revocation Workflow:** Authoritative revocation on-chain with immutable reason string, preventing subsequent fraudulent presentation.

### C. Recruiter Persona
- **Requisition Management:** Create new job requisitions (`/recruiter/jobs/new`) with required competencies, preferred skills, compensation bands, and location criteria.
- **Applicant Pipeline:** Review candidates filtered by job requisition with explainable match percentages, missing competency analysis, and cryptographic proof verification badges.
- **Hiring Funnel:** Update candidate progress (`SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`) with recruiter feedback notes.

### D. Platform SuperAdmin Persona
- **User Governance:** Inspect, search, filter, activate, or suspend users across all four roles.
- **Institution Accreditation Queue:** Review pending educational institutions and approve or reject issuance privileges.
- **Security Audit Trail:** Query immutable action audit logs across the platform.

---

## 3. Dual-Mode Persistence: Offline Development & Production SaaS

ProofHire is built with **zero external blockers** for local evaluation while supporting full cloud SaaS deployment:

| Layer | Offline / Standalone Mode | Production Cloud SaaS Mode |
| :--- | :--- | :--- |
| **Database** | In-Memory Stateful Adapter (`userStore`, `institutionsStore`) | PostgreSQL via Prisma ORM (`DATABASE_URL`) |
| **Blockchain** | Local Hardhat EVM Node (Chain ID `31337`, Port `8545`) | Ethereum Sepolia / Arbitrum / Base (Infura / Alchemy RPC) |
| **AI Engine** | Local Uvicorn FastAPI (Port `8000`) | Containerized FastAPI on AWS ECS / Cloud Run |
| **Web Frontend** | Next.js Dev Server (Port `3000`) | Vercel / AWS Amplify / Cloudflare Pages |

---

## 4. How to Run for Evaluation & Demonstration

### Step 1: Health Diagnostic
```bash
npm run health
```
Ensures all 4 microservices are online and responsive:
- Hardhat EVM: `http://127.0.0.1:8545`
- FastAPI AI: `http://localhost:8000`
- NestJS API: `http://localhost:4000/api`
- Next.js Web: `http://localhost:3000`

### Step 2: Run Automated Test Suites
```bash
# 1. Smart contract security suite (29 tests)
npm run test --workspace=@proofhire/blockchain

# 2. Python AI rubric & parsing suite (16 tests)
npm run test:ai

# 3. NestJS API unit tests (38 tests)
npm run test --workspace=@proofhire/api

# 4. Multi-service end-to-end integration (27 tests)
npm run test:e2e

# 5. Full real-user lifecycle test (14 steps)
npm run test:lifecycle

# 6. Interactive demo walkthrough (10 steps)
npm run demo:verify
```

---

## 5. Production SaaS Deployment Steps

1. **Deploy Smart Contracts:**
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.ts --network sepolia
   ```
2. **Provision PostgreSQL:**
   Set `DATABASE_URL="postgresql://user:pass@host:5432/proofhire?sslmode=require"` in `services/api/.env`.
   Run migrations:
   ```bash
   npx prisma migrate deploy --schema=services/api/prisma/schema.prisma
   ```
3. **Deploy Containerized Backend:**
   Use `docker/docker-compose.yml` or individual container registries.
4. **Deploy Next.js Frontend:**
   Configure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_AI_URL` and deploy with `npm run build:web`.
