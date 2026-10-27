# ProofHire — 5-to-7 Minute End-to-End Demonstration Script

This script walks through the **principal product acceptance scenario** (Section 1 of Prompt 3) covering all 4 portals, on-chain credential issuance, AI resume intelligence, recruiter matching, and cryptographic revocation.

---

## Prerequisites for Live Demonstration
1. Web Frontend running on `http://localhost:3000`
2. NestJS Backend running on `http://localhost:4000`
3. FastAPI AI Microservice running on `http://localhost:8000`
4. Smart contracts deployed on local Hardhat node or Polygon Amoy

---

## Act I: Institutional Credential Issuance & On-Chain Anchoring (1.5 min)

1. Open `http://localhost:3000/login` in your browser.
2. Click **Demo: Institution** to log in as `institution@proofhire.io`.
3. Navigate to **Issue Credential** (`/institution/credentials/issue`).
4. **Select Candidate**: Select `Alex Rivera (usr_student_01)`.
5. **Set Degree Details**:
   - Title: `Bachelor of Science in Computer Science`
   - Credential Type: `DEGREE`
   - Graduation Year: `2025`
   - Honors: `Summa Cum Laude (GPA 3.92)`
6. **Upload Certificate**: Drag and drop a sample certificate PDF.
   - *Notice:* ProofHire calculates the SHA-256 digest (`crypto.subtle.digest`) in real-time in the browser.
7. Click **Sign & Issue Credential On-Chain**.
   - Watch the 4-step progressive timeline: File Validation -> Keccak-256 Digest Calculation -> Smart Contract Anchoring -> Block Confirmation.
   - A verified transaction receipt appears with Transaction Hash, Block Number, and QR Code link.

---

## Act II: Student Sovereign Profile & AI Resume Intelligence (1.5 min)

1. Log out or open an incognito window at `http://localhost:3000/login`.
2. Click **Demo: Student** to log in as `student@proofhire.io`.
3. Go to **My Credentials** (`/student/credentials`):
   - Verify that the newly issued Stanford degree appears with the emerald **Blockchain Verified** badge.
4. Go to **AI Resume Intelligence** (`/student/resume`):
   - Upload a candidate resume (PDF or DOCX).
   - View the deterministic **100-point rubric breakdown**:
     - Skill Breadth: `24/25`
     - Experience Trajectory: `22/25`
     - Quantified Impact: `23/25`
     - Formatting & Cleanliness: `24/25`
     - **Cryptographic Verification Boost**: `+15 pts` awarded for on-chain verified Stanford credentials.
   - Review actionable feedback categorized by priority (High, Medium, Low).
5. Visit the candidate's **Public Digital Passport** (`/u/alexrivera`):
   - Notice the clear differentiation between:
     1. *Institutionally Verified Competencies* (anchored to smart contracts)
     2. *Resume-Extracted Technical Skills* (NLP confidence tagged)
     3. *Self-Declared Skills*

---

## Act III: Recruiter Job Posting & Candidate Application (1.5 min)

1. In `/student/jobs`, view active job openings.
2. Find the role: **Senior Blockchain & Full-Stack Engineer** at *Aether Cryptographic Labs*.
3. Click **Apply with Verified Credentials**:
   - Provide a brief cover letter.
   - Submit the application.
   - Notice the button immediately updates to **Application Submitted ✓**.
4. In `/student/applications`, observe the application with its live stage progress tracker (`Applied` -> `Under Review` -> `Shortlisted`).

---

## Act IV: Recruiter Review & Explainable AI Candidate Matching (1.5 min)

1. Switch back to recruiter session at `http://localhost:3000/login` -> **Demo: Recruiter** (`recruiter@proofhire.io`).
2. Go to **Applications Pipeline** (`/recruiter/applications`):
   - The applicant *Alex Rivera* appears at the top.
   - Click the **94% AI Fit** button to open the **Explainable AI Matching Breakdown**:
     - Required Skills Matched: 4/4 (`TypeScript`, `Next.js`, `Solidity`, `PostgreSQL`)
     - Missing Required Skills: None
     - Verification Bonus: `+15%`
     - Methodology: `deterministic_v2_weighted`
3. Advance the candidate stage:
   - Click **Shortlist** or **Schedule Interview**.
   - Click **Add Note** to record internal recruiter review notes (*"Top candidate with on-chain verified Stanford degree"*).

---

## Act V: Public Verification & Credential Revocation (1 min)

1. In the recruiter pipeline or public browser, open the public verification link:
   - `http://localhost:3000/verify/CRED-STANFORD-2025-001`
   - Notice the status: **VERIFIED (Authentic & Valid)**.
   - Drop the original certificate PDF into the verification zone:
     - Notice the green confirmation: *"Cryptographic Match Confirmed: Document byte digest matches on-chain record."*
2. **Demonstrate Revocation**:
   - Return to Institution Portal -> **Credentials Directory** (`/institution/credentials`).
   - Click **Revoke** on `CRED-STANFORD-2025-001`.
   - In the confirmation dialog, enter reason: *"Clerical correction / reissue requested"*.
   - Confirm revocation. The smart contract transaction is signed and confirmed.
3. **Verify Revocation**:
   - Refresh the public verification page (`/verify/CRED-STANFORD-2025-001`).
   - Notice the status immediately updates to: **REVOKED (Credential Revoked by Issuer)**.
   - Shows the exact revocation timestamp, revocation transaction, and recorded reason.

This completes the 20-step verification lifecycle demonstration.
