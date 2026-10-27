# ProofHire — Test Accounts & Seed Demonstration Personas

For local evaluations and demonstration walks, ProofHire includes pre-seeded demonstration accounts. The `/login` page provides **one-click login buttons** that automatically populate the session for each role.

---

## Pre-Configured Demonstration Accounts

| Persona / Role | Email Address | Password | Primary Portal Route | Key Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@proofhire.io` | `Student123!` | `/student/dashboard` | Manage verified credentials, upload resumes for AI scoring, discover jobs, apply with proofs, and view public digital passport. |
| **Recruiter** | `recruiter@proofhire.io` | `Recruiter123!` | `/recruiter/dashboard` | Post job requisitions, inspect incoming applicants, evaluate AI matching scores, verify candidate credentials, and record notes. |
| **Institution** | `institution@proofhire.io` | `Institution123!` | `/institution/dashboard` | Issue verifiable academic degrees and certificates on-chain with document hashing, manage student cohorts, and enforce revocations. |
| **SuperAdmin** | `admin@proofhire.io` | `Admin123!` | `/admin/dashboard` | Authorize and suspend institutions, manage user access, inspect immutable security audit trails, and monitor system health. |

---

## Seed Candidate Profiles

### 1. Alex Rivera (`alexrivera`)
- **Email:** `student@proofhire.io`
- **Headline:** Senior Software Engineer & Distributed Consensus Researcher
- **Education:** Stanford University, B.S. in Computer Science (Summa Cum Laude, GPA 3.92)
- **Public Profile:** `http://localhost:3000/u/alexrivera`
- **Verified Credentials:**
  - `CRED-STANFORD-2025-001`: Bachelor of Science in Computer Science (Stanford)
  - `CRED-MIT-2025-089`: Advanced Cryptographic Engineering Certificate (MIT)

### 2. Maya Patel (`mayapatel`)
- **Email:** `maya.patel@berkeley.edu`
- **Headline:** Blockchain Protocol Engineer
- **Education:** UC Berkeley, B.S. in Electrical Engineering and Computer Sciences
- **Verified Credentials:**
  - `CRED-MIT-2024-001`: Applied Cryptography Certification

---

## Seed Job Requisitions

| Job ID | Title | Company | Status | Required Skills |
| :--- | :--- | :--- | :--- | :--- |
| `job-001` | **Senior Blockchain & Full-Stack Engineer** | Aether Cryptographic Labs | `OPEN` | `TypeScript`, `Next.js`, `Solidity`, `PostgreSQL` |
| `job-002` | **AI Verification Systems Engineer** | Veritas Security | `OPEN` | `Python`, `FastAPI`, `PyTorch`, `Vector Databases` |
| `job-003` | **Frontend React / Next.js Engineer** | Nexus Decentralized Finance | `OPEN` | `React`, `Next.js`, `Tailwind CSS`, `TypeScript` |

---

## Password & Secret Safety Notice
The seed passwords above are intended solely for local testing and demonstration. Real production deployments require environment-injected secret keys and mandatory multi-factor authentication (MFA) for institutional and administrative accounts.
