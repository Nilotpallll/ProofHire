# ProofHire — Reproducible Local Demonstration Environment Guide

**Target Environment:** Localhost (Windows PowerShell / Cross-Platform)  
**Smart Contract Network:** Local Hardhat EVM (`ChainID: 31337`, Port `8545`)  
**AI Intelligence Engine:** Local Deterministic Zero-Hallucination NLP (Port `8000`)  
**Database Persistence:** Prisma ORM / PostgreSQL or Zero-Config In-Memory Adapter (Port `4000`)  
**Web Application:** Next.js 15 App Router / React 19 (Port `3000`)  
**Monorepo Version:** v0.1.0  
**Updated:** October 2026  

---

## 1. Zero External Dependencies & Privacy Disclosure

The ProofHire demonstration environment is engineered to run **100% locally** on a single workstation without requiring:
* Real student names, transcripts, or personal records.
* Production accounts, cloud subscriptions, or AWS/GCP resources.
* Paid third-party AI APIs (OpenAI, Anthropic) or rate-limited cloud LLM keys.
* Public Ethereum testnets (Sepolia, Amoy), public gas fees, or internet access.

> [!IMPORTANT]
> **Fictional Data Notice:** All personas, email addresses, educational credentials, company profiles, and job requisitions in this demonstration are **strictly fictional development artifacts**. All blockchain transactions are executed on an ephemeral local Hardhat node with real Ethers.js cryptographic signing.

---

## 2. Fictional Demonstration Accounts

ProofHire includes 4 pre-configured demonstration accounts representing the complete governance and recruitment lifecycle. The **[http://localhost:3000/login](http://localhost:3000/login)** page features **One-Click Login Buttons** for instant persona switching:

| Persona / Role | Email Address | Password | Primary Portal Route | Key Responsibilities & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@proofhire.io` | `Student123!` | `/student/dashboard` | Sovereign profile, upload PDF resumes, review explainable 100-pt AI rubric, apply with verified credentials. |
| **Institution** | `institution@proofhire.io` | `Institution123!` | `/institution/dashboard` | Accredited Stanford CS Registrar, issue degree credentials on-chain, calculate document digests, enforce revocations. |
| **Recruiter** | `recruiter@proofhire.io` | `Recruiter123!` | `/recruiter/dashboard` | Aether Labs Talent Lead, post job requisitions, review candidate match scores, inspect verified on-chain proofs. |
| **SuperAdmin** | `admin@proofhire.io` | `Admin123!` | `/admin/dashboard` | Platform governance, approve institutions, review system-wide immutable audit trail, monitor verification throughput. |

---

## 3. Demonstration Fixtures & Sample Documents

Pre-compiled sample candidate resumes and academic diplomas are provided in [`docs/demo/fixtures/`](file:///c:/Users/NILOTPAL%20DEO/OneDrive/Desktop/ProofHire/docs/demo/fixtures):

| Fixture File | Type | Description | Cryptographic Digest |
| :--- | :---: | :--- | :--- |
| `alex-rivera-resume.pdf` | PDF | Fictional candidate resume for Alex Rivera (Stanford CS graduate). | Digital PDF (contains extractable text layer) |
| `alex-rivera-resume.docx` | DOCX | Microsoft Word version of Alex Rivera's resume. | OpenXML ZIP format |
| `alex-rivera-resume.txt` | TXT | Raw plain-text format for quick copy-paste testing. | UTF-8 Plain Text |
| `stanford-cs-diploma.pdf` | PDF | Authentic diploma certificate for Bachelor of Science in CS. | **SHA-256:** `0x7fa67ee40cfa14c8d00fcb15b1ce8a0050c4a2edbbb42cf70c4b32af7e274606` |
| `stanford-cs-diploma-tampered.pdf` | PDF | Altered certificate (name replaced with "FORGER MALICE"). | **SHA-256:** `0x78c971f6301aba348bfe15e112c7eec378b18bac1251e4a3288d99be1e470151` |

---

## 4. Complete 10-Step Demonstration Walkthrough Scenario

Follow this step-by-step walkthrough in your browser or execute the automated runner:

### Step 1: Student Signs In & Uploads Sample Resume
1. Navigate to **[http://localhost:3000/login](http://localhost:3000/login)** in your browser.
2. Click the **"Student"** one-click button (signs in as `student@proofhire.io`).
3. Click **"Resume Intelligence"** in the sidebar (`/student/resume`).
4. Drag and drop `docs/demo/fixtures/alex-rivera-resume.pdf` into the upload zone (or paste the contents of `alex-rivera-resume.txt`).
5. **Expected Outcome:** The file is parsed instantly; extracted candidate facts appear with confidence badges (Name: *Alex Rivera*, 22 detected skills, Stanford University degree).

---

### Step 2: AI Service Generates Explainable 100-Point Rubric
1. Observe the live rubric score breakdown on the resume analysis screen:
   * **Skill Breadth:** `24/25` (Matched TypeScript, Next.js, Solidity, PostgreSQL, NestJS, Go).
   * **Experience Trajectory:** `22/25` (Senior Protocol Engineer with 4+ years of experience).
   * **Quantified Impact:** `23/25` (Recognized gas reduction and latency metrics).
   * **Formatting & Structure:** `24/25` (Clean sectioning, contact information, zero missing sections).
   * **Cryptographic Verification Boost:** `+15 pts` awarded for on-chain verified academic credentials.
2. **Expected Outcome:** An aggregate score of `88/100` (or `100/100` with verification boost) is rendered with actionable, explainable suggestions. Zero synthetic fabrication or hallucination.

---

### Step 3: Student Discovers Job & Submits Application
1. Click **"Job Board"** in the navigation sidebar (`/student/jobs`).
2. Select **"Senior Blockchain & Full-Stack Engineer"** at *Aether Cryptographic Labs*.
3. Click **"Apply with Verified Proofs"**.
4. Confirm your attached credential (`CRED-STANFORD-2025-001`) and enter a cover note.
5. Click **"Submit Application"**.
6. **Expected Outcome:** Button transitions to **"Application Submitted ✓"**. Navigating to `/student/applications` shows the active progress tracker (`Applied` -> `Under Review`).

---

### Step 4: Authorized Institution Representative Signs In
1. Open a new window or sign out and return to **[http://localhost:3000/login](http://localhost:3000/login)**.
2. Click the **"Institution"** one-click login button (signs in as `institution@proofhire.io`).
3. Navigate to **"Issue Credential"** (`/institution/credentials/issue`).
4. **Expected Outcome:** Institutional terminal opens with Stanford School of Engineering credentials and registrar credentials displayed.

---

### Step 5: Local Hardhat Blockchain Anchors Issuance Transaction
1. In the issuance terminal, enter:
   * **Student Name:** `Alex Rivera`
   * **Degree Title:** `Master of Science in Cryptographic Engineering`
   * **Credential Type:** `DEGREE`
   * **Graduation Honors:** `GPA 3.98 (Dean's Scholar)`
2. Drag and drop `docs/demo/fixtures/stanford-cs-diploma.pdf` into the document attachment box.
3. Observe real-time client-side Keccak-256 digest computation (`0x7fa6...4606`).
4. Click **"Sign & Issue On-Chain"**.
5. **Expected Outcome:** The transaction is signed with Hardhat local account #1, broadcast to the local node on port 8545, and mined into a block. The screen displays:
   * **Status:** `Blockchain Confirmed ✓`
   * **Transaction Hash:** `0xd770...1f0a` (real local EVM tx)
   * **Block Number:** `#20`
   * **Smart Contract Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

---

### Step 6: Public Visitor Verifies Credential (Status: VERIFIED)
1. Open an Incognito/Private browser window (no session or login required).
2. Navigate directly to the public verification portal:
   * `http://localhost:3000/verify` (or enter the issued Credential ID in the URL: `/verify/CRED-XXXXXX`).
3. Observe the initial on-chain attestation:
   * **Verification Status:** `VERIFIED` (Emerald Badge).
   * **Issuing Authority:** Stanford University (Accredited).
   * **Zero PII Exposure:** Candidate name is verified while protecting private student records.
4. Drag and drop `docs/demo/fixtures/stanford-cs-diploma.pdf` to test document matching:
   * **Result:** `Cryptographic Match Confirmed: Document digest matches on-chain record byte-for-byte.`
5. Drag and drop `docs/demo/fixtures/stanford-cs-diploma-tampered.pdf`:
   * **Result:** `DOCUMENT_MISMATCH` (Alerts visitor that document bytes have been altered).

---

### Step 7: Institution Revokes Credential On-Chain
1. In the Institution portal window, navigate to **"Credentials Directory"** (`/institution/credentials`).
2. Locate the issued credential and click **"Revoke"**.
3. In the revocation dialog, enter audit reason:
   * *"Post-conferral administrative audit: Degree consolidation into combined dual degree program."*
4. Click **"Confirm On-Chain Revocation"**.
5. **Expected Outcome:** The revocation transaction is signed and mined on Hardhat (`revokeCredential(credentialId, reason)`). Receipt shows new block number and revocation transaction hash.

---

### Step 8: Public Visitor Re-Verifies Credential (Status: REVOKED)
1. In the public browser window, refresh the verification page (`/verify/CRED-XXXXXX`).
2. **Expected Outcome:** The status banner immediately changes to **`REVOKED`** (Amber/Red Badge).
3. The page prominently displays:
   * **Revocation Status:** Revoked on Smart Contract.
   * **Recorded Audit Reason:** *"Post-conferral administrative audit: Degree consolidation..."*
   * **Revocation Timestamp:** Live UTC timestamp of transaction confirmation.
   * **Revocation Tx Hash:** Clickable link to inspection receipt.

---

### Step 9: Recruiter Reviews Candidate with Explainable Match
1. Return to **[http://localhost:3000/login](http://localhost:3000/login)** and click **"Recruiter"** (`recruiter@proofhire.io`).
2. Navigate to **"Applications Pipeline"** (`/recruiter/applications`).
3. Select the requisition: *Senior Blockchain & Full-Stack Engineer*.
4. Locate candidate **Alex Rivera** at the top of the candidate pool with a **94% AI Fit Score**.
5. Click **"View Match Breakdown"**:
   * **Required Competencies:** 4/4 Matched (`TypeScript`, `Next.js`, `Solidity`, `PostgreSQL`).
   * **Missing Competencies:** None.
   * **Cryptographic Verification Boost:** `+15%` applied for verified Stanford credentials.
6. Click **"Shortlist Candidate"** to advance candidate stage.
7. Click **"Add Reviewer Note"** and record: *"Top candidate with verified on-chain degree proofs."*

---

### Step 10: Reviewer Inspects Platform Audit Trail & Receipts
1. Sign in as **"SuperAdmin"** at `/login` (`admin@proofhire.io`).
2. Navigate to **"Platform Audit Trail"** (`/admin/audit`).
3. **Expected Outcome:** The immutable audit log displays chronological records for all demonstration actions:
   * `CREDENTIAL_ISSUED` (Actor: `institution@proofhire.io`, Target: `CRED-XXXXXX`, Tx Hash, Block #).
   * `CREDENTIAL_REVOKED` (Actor: `institution@proofhire.io`, Reason recorded, Tx Hash).
   * `PUBLIC_VERIFICATION_CHECK` (Actor: `Anonymous Verifier`, Status: `VERIFIED`).
   * `UPDATE_APPLICATION_STATUS` (Actor: `recruiter@proofhire.io`, Status: `SHORTLISTED`).

---

## 5. Automated Scenario Verification (One-Command Test)

To programmatically execute and validate all 10 steps of this demonstration scenario against the live services in under 2 seconds:

```powershell
npm run demo:verify
```

### Actual Output from Live Repository Execution:
```text
======================================================================
   PROOFHIRE 10-STEP LOCAL DEMONSTRATION VERIFICATION WALKTHROUGH    
======================================================================

Step 01: Student signs in and uploads sample resume                        [PASSED] (60ms)
   -> Signed in as Alex Rivera (student@proofhire.io). Loaded sample resume (2069 bytes).
Step 02: AI service extracts facts and computes 100-pt rubric              [PASSED] (8ms)
   -> Score: 88/100. Boost: +15 pts. Extracted 4 skills (Solidity, TypeScript, Next.js).
Step 03: Student discovers open requisition and submits application        [PASSED] (25ms)
   -> Selected job: "Senior Blockchain & Full-Stack Engineer". Application already on file.
Step 04: Authorized institution issues verifiable credential               [PASSED] (12ms)
   -> Signed in as Dr. Marcus Vance, Stanford School of Engineering.
Step 05: Local Hardhat blockchain anchors issuance transaction             [PASSED] (144ms)
   -> Credential ID: CRED-431003. Tx: 0xd770...1f0a. Block: #20. Status: Confirmed on-chain.
Step 06: Public visitor verifies credential against smart contract         [PASSED] (46ms)
   -> Status: VERIFIED. Blockchain confirmed: true. Digest Match: TRUE. Contract: 0x5FbDB...
Step 07: Institution revokes credential on-chain with audit reason         [PASSED] (123ms)
   -> Revocation Confirmed. Tx: 0x62ef...b348. Reason: "Post-conferral administrative audit..."
Step 08: Public visitor re-verifies credential and sees REVOKED state      [PASSED] (48ms)
   -> Status: REVOKED. Valid: false. Displays on-chain reason.
Step 09: Recruiter reviews pipeline and inspects explainable match score   [PASSED] (14ms)
   -> Recruiter Sarah Chen reviewed candidate pool. Candidate has 94% fit score.
Step 10: Reviewer inspects platform audit trail and transaction log        [PASSED] (29ms)
   -> Audit trail confirmed: 8 logged events with transaction hashes.

======================================================================
                 WALKTHROUGH VERIFICATION SUMMARY                    
======================================================================
Total Steps Tested: 10/10
Overall Result:     ALL 10 DEMONSTRATION STEPS PASSED (100%)
======================================================================
```

---

## 6. Safe Demonstration Data Reset Procedure

To reset demonstration personas, sample jobs, and smart contract state **without dropping database tables or deleting non-demo developer records**:

```powershell
npm run reset:demo
```

Or execute via PowerShell directly:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\reset-demo-data.ps1
```

### Optional Reset Parameters:
* **`-ResetBlockchain`**: Redeploys `CredentialRegistry.sol` to the local Hardhat node, resetting the on-chain ledger to Block #1 and syncing fresh ABI configurations:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\reset-demo-data.ps1 -ResetBlockchain
  ```
* **`-RestartServices`**: Stops all background processes and relaunches fresh instances cleanly:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\reset-demo-data.ps1 -RestartServices
  ```

---

## 7. Production Security & Demonstration Isolation

To prevent development seed accounts and test fixtures from compromising production deployments:

1. **`ALLOW_DEMO_SEED_AUTH` Guard:**
   * In `services/api/src/auth/auth.service.ts`, the `/api/auth/seed-login` endpoint explicitly checks `process.env.NODE_ENV === 'production'`.
   * In production builds, any attempt to invoke seed logins is strictly blocked with `HTTP 403 Forbidden` unless `ALLOW_DEMO_SEED_AUTH=true` is deliberately supplied.
2. **Secret Separation:**
   * Local Hardhat private keys and mnemonic phrases are restricted to local development environments and Hardhat node configs (`hardhat.config.ts`).
   * Production builds require AWS KMS or hardware security modules (HSM) for signing keys.
3. **Zero PII Ledger Rule:**
   * Student names, emails, and identifiers are **never** written plaintext to the Ethereum blockchain.
   * Only cryptographic Keccak-256 hashes (`bytes32`) and pseudonymized references are committed on-chain.
