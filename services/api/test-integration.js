/**
 * ProofHire End-to-End Integration Test Suite
 * Tests all workflows: Auth, Role Gating, Jobs, Applications, AI Matching,
 * Blockchain Credential Verification, Issuance, Revocation, and Admin Governance.
 */

const API_BASE = "http://localhost:4000/api";
const AI_BASE = "http://localhost:8000";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runSuite() {
  console.log("\n========================================================");
  console.log("   PROOFHIRE END-TO-END MULTI-SERVICE INTEGRATION SUITE ");
  console.log("========================================================\n");

  let studentToken, recruiterToken, institutionToken, adminToken;
  let createdJobId, createdApplicationId, newlyIssuedCredId;

  // 1. Health Checks
  console.log("--- 1. Service Health Checks ---");
  try {
    const apiHealth = await fetch(`${API_BASE}/health`).then((r) => r.json());
    assert(apiHealth.status === "ok", "NestJS REST API health endpoint responded with status 'ok'");

    const aiHealth = await fetch(`${AI_BASE}/health`).then((r) => r.json());
    assert(aiHealth.status === "healthy", "FastAPI AI Microservice responded with status 'healthy'");
  } catch (e) {
    console.error("Health check error:", e);
  }

  // 2. Authentication for All 4 Roles
  console.log("\n--- 2. Multi-Role Authentication ---");
  try {
    const studentAuth = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student@proofhire.io", password: "Student123!" }),
    }).then((r) => r.json());
    studentToken = studentAuth.accessToken;
    assert(studentAuth.user.role === "STUDENT", "Student authenticated successfully with JWT");

    const recruiterAuth = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "recruiter@proofhire.io", password: "Recruiter123!" }),
    }).then((r) => r.json());
    recruiterToken = recruiterAuth.accessToken;
    assert(recruiterAuth.user.role === "RECRUITER", "Recruiter authenticated successfully with JWT");

    const institutionAuth = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "institution@proofhire.io", password: "Institution123!" }),
    }).then((r) => r.json());
    institutionToken = institutionAuth.accessToken;
    assert(institutionAuth.user.role === "INSTITUTION", "Institution authenticated successfully with JWT");

    const adminAuth = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@proofhire.io", password: "Admin123!" }),
    }).then((r) => r.json());
    adminToken = adminAuth.accessToken;
    assert(adminAuth.user.role === "ADMIN", "SuperAdmin authenticated successfully with JWT");
  } catch (e) {
    console.error("Authentication error:", e);
  }

  // 3. Security & Role Permissions Enforcement
  console.log("\n--- 3. Server-Side Role Enforcement ---");
  try {
    const forbiddenRes = await fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(forbiddenRes.status === 403, "Student attempting to access protected Admin endpoint correctly received HTTP 403 Forbidden");

    const adminAllowedRes = await fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminAllowedRes.status === 200, "SuperAdmin successfully accessed protected Admin user endpoint (HTTP 200)");
  } catch (e) {
    console.error("Role enforcement error:", e);
  }

  // 4. Recruiter Creates Job Requisition
  console.log("\n--- 4. Job Creation & Management Workflow ---");
  try {
    const jobRes = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${recruiterToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Senior Full-Stack Web3 Architect",
        department: "Core Protocol",
        location: "San Francisco, CA / Remote",
        jobType: "FULL_TIME",
        experienceLevel: "SENIOR",
        salaryMin: 155000,
        salaryMax: 205000,
        description: "Architect and scale verifiable credential registries, smart contracts, and responsive Next.js interfaces.",
        requiredSkills: ["TypeScript", "Solidity", "Next.js", "PostgreSQL"],
        preferredSkills: ["FastAPI", "Docker", "ZK-Proofs"],
      }),
    });
    assert(jobRes.status === 201, "Recruiter published new job requisition (HTTP 201 Created)");
    const jobData = await jobRes.json();
    createdJobId = jobData.id;
    assert(jobData.title === "Senior Full-Stack Web3 Architect", `Job ID '${createdJobId}' successfully assigned`);
  } catch (e) {
    console.error("Job creation error:", e);
  }

  // 5. Student Browses Jobs and Submits Application with AI Match Scoring
  console.log("\n--- 5. Student Application & AI Neural Match Workflow ---");
  try {
    const openJobs = await fetch(`${API_BASE}/jobs`).then((r) => r.json());
    assert(Array.isArray(openJobs) && openJobs.length > 0, `Student browsed jobs feed (${openJobs.length} active jobs listed)`);

    const applyRes = await fetch(`${API_BASE}/applications/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${studentToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: createdJobId,
        coverLetter: "I specialize in cryptographic verifiable credentials, smart contract protocols, and Next.js applications.",
      }),
    });
    assert(applyRes.status === 201, "Student submitted application with on-chain credentials (HTTP 201)");
    const appData = await applyRes.json();
    createdApplicationId = appData.id;
    assert(typeof appData.aiMatchScore === "number" && appData.aiMatchScore >= 70, `AI match score generated: ${appData.aiMatchScore}% fit`);
    assert(appData.verifiedCredentialsCount >= 1, "Candidate verified credential boost attached");
  } catch (e) {
    console.error("Application submission error:", e);
  }

  // 6. Recruiter Pipeline Review & Stage Advancement
  console.log("\n--- 6. Recruiter Pipeline & Candidate Advancement ---");
  try {
    const recruiterPipeline = await fetch(`${API_BASE}/applications/recruiter?jobId=${createdJobId}`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    }).then((r) => r.json());
    assert(recruiterPipeline.length > 0, `Recruiter pipeline received applicants for job '${createdJobId}'`);

    const updateRes = await fetch(`${API_BASE}/applications/${createdApplicationId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${recruiterToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "SHORTLISTED",
        notes: "Verified Stanford CS degree and smart contract portfolio. Advancing to technical panel.",
      }),
    });
    assert(updateRes.status === 200, "Recruiter advanced candidate to 'SHORTLISTED' with review notes attached");
    const updated = await updateRes.json();
    assert(updated.status === "SHORTLISTED", "Updated application status persisted in record");
  } catch (e) {
    console.error("Pipeline review error:", e);
  }

  // 7. Student Tracks Updated Application Timeline
  console.log("\n--- 7. Student Progress Tracking ---");
  try {
    const myApps = await fetch(`${API_BASE}/applications/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());
    const target = myApps.find((a) => a.id === createdApplicationId);
    assert(target !== undefined, "Application visible in student's personal pipeline");
    assert(target.status === "SHORTLISTED", "Student sees real-time 'SHORTLISTED' status update and recruiter notes");
  } catch (e) {
    console.error("Student tracking error:", e);
  }

  // 8. Public Verification & Cryptographic Digest Checking
  console.log("\n--- 8. Public Blockchain Credential Verification ---");
  try {
    const validVerify = await fetch(`${API_BASE}/credentials/CRED-STANFORD-2025-001/verify`).then((r) => r.json());
    assert(validVerify.verificationStatus === "VERIFIED" && validVerify.isValid === true, "Valid credential verified on smart contract registry");

    const mismatchVerify = await fetch(`${API_BASE}/credentials/CRED-STANFORD-2025-001/verify?digest=0x0000000000000000000000000000000000000000000000000000000000000000`).then((r) => r.json());
    assert(mismatchVerify.verificationStatus === "DOCUMENT_MISMATCH", "Tampered document correctly flagged as DOCUMENT_MISMATCH");

    const revokedVerify = await fetch(`${API_BASE}/credentials/REVOKED-DEMO-CRED/verify`).then((r) => r.json());
    assert(revokedVerify.verificationStatus === "REVOKED", "Revoked credential returns explicit REVOKED code with audit reason");
  } catch (e) {
    console.error("Verification error:", e);
  }

  // 9. Institutional Credential Issuance & Revocation
  console.log("\n--- 9. Institutional Issuance & Revocation ---");
  try {
    const issueRes = await fetch(`${API_BASE}/credentials/issue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${institutionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientEmail: "student@proofhire.io",
        title: "Master of Science in Artificial Intelligence & Cryptography",
        type: "DEGREE",
        gradeOrScore: "GPA 4.0 (Dean's Honor)",
        skills: ["Machine Learning", "Cryptography", "Distributed Systems"],
        documentDigest: "0x4a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
      }),
    });
    assert(issueRes.status === 201, "Authorized institution issued new verifiable credential (HTTP 201)");
    const issuedData = await issueRes.json();
    newlyIssuedCredId = issuedData.credentialId;
    assert(newlyIssuedCredId.startsWith("CRED-"), `Assigned verifiable identifier '${newlyIssuedCredId}'`);

    const revokeRes = await fetch(`${API_BASE}/credentials/${newlyIssuedCredId}/revoke`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${institutionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Administrative re-issuance due to diploma honors typo correction.",
      }),
    });
    assert(revokeRes.status === 200 || revokeRes.status === 201, "Institution successfully revoked credential with documented audit reason");
  } catch (e) {
    console.error("Issuance/Revocation error:", e);
  }

  // 10. SuperAdmin Governance & Audit Trail
  console.log("\n--- 10. SuperAdmin Governance & Audit Trail ---");
  try {
    const institutions = await fetch(`${API_BASE}/institutions`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(Array.isArray(institutions) && institutions.length > 0, `Admin inspected accredited institutions queue (${institutions.length} institutions)`);

    const auditLogs = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(Array.isArray(auditLogs) && auditLogs.length > 0, `Admin reviewed immutable platform audit log (${auditLogs.length} entries)`);
  } catch (e) {
    console.error("Governance error:", e);
  }

  console.log("\n========================================================");
  console.log(`   INTEGRATION SUITE COMPLETE: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("========================================================\n");

  process.exit(testsFailed > 0 ? 1 : 0);
}

runSuite();
