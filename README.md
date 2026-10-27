# ProofHire

> **"Trust Skills. Verify Credentials. Hire Faster."**

ProofHire is an AI-powered decentralized academic and professional credential verification and recruitment platform. It eliminates fake degrees, reduces background check delays from 2 weeks to sub-second verification, and empowers students with sovereign, portable credentials.

---

## Architecture At A Glance

- **Frontend (`apps/web`)**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Backend API (`services/api`)**: NestJS, TypeScript, Prisma ORM, PostgreSQL, Passport JWT, Swagger OpenAPI on Port 4000.
- **AI Service (`services/ai`)**: Python 3.12+ FastAPI, Pydantic, Uvicorn on Port 8000.
- **Blockchain (`blockchain`)**: Solidity 0.8.20 Smart Contracts on Hardhat with Sepolia EVM support.
- **Packages**: Shared domain types (`@proofhire/types`), base configuration (`@proofhire/config`), and design tokens (`@proofhire/ui`).

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Applications Locally
```bash
# Run Next.js Web Frontend (Port 3000)
npm run dev:web

# Run NestJS API (Port 4000)
npm run dev:api

# Run AI Service (Port 8000)
cd services/ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Multi-Role Portals

ProofHire provides dedicated portals across 4 key roles:
- **Student Portal** (`/student/dashboard`): Manage on-chain verified credentials, AI resume scores, job applications, and public portfolio.
- **Recruiter Portal** (`/recruiter/dashboard`): Post job requisitions, search verified candidates, and manage applicant pipeline.
- **Institution Portal** (`/institution/dashboard`): Issue verified diplomas/certificates on-chain, manage student cohorts, and enforce revocations.
- **Admin Portal** (`/admin/dashboard`): Institutional accreditation approvals, user management, and security audit logs.
- **Public Verification** (`/verify/[credentialId]`): Instant, zero-sign-in public verification of cryptographic authenticity.

---

## Seed Demonstration Logins

Access `/login` and select any 1-click demo persona:
- **Student:** `student@proofhire.io` (Password: `Student123!`)
- **Recruiter:** `recruiter@proofhire.io` (Password: `Recruiter123!`)
- **Institution:** `institution@proofhire.io` (Password: `Institution123!`)
- **Admin:** `admin@proofhire.io` (Password: `Admin123!`)

---

## Documentation

- [System Architecture](docs/architecture/system-overview.md)
- [Architectural Decisions (ADR)](docs/architecture/decisions.md)
- [Database Schema & Prisma Design](docs/architecture/database-design.md)
- [Accessibility Compliance (WCAG 2.2 AA)](docs/architecture/accessibility.md)
- [API Overview & Swagger Specs](docs/api/api-overview.md)
