/**
 * ProofHire — Comprehensive End-to-End & Integration Test Suite
 * 
 * Verifies live interaction across:
 * 1. Hardhat Ethereum RPC (Port 8545) & CredentialRegistry.sol
 * 2. FastAPI AI Intelligence Service (Port 8000)
 * 3. NestJS REST API (Port 4000)
 * 4. Multi-Role RBAC (STUDENT, RECRUITER, INSTITUTION, ADMIN)
 * 5. Recruitment Pipeline (Jobs, Applications, Scoring, Review)
 * 6. Failure, Security, and Tampering Resilience
 */

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(suite: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ suite, name, passed: true, durationMs });
    console.log(`  ✓ [${suite}] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({ suite, name, passed: false, durationMs, error: err.message || String(err) });
    console.error(`  ✗ [${suite}] ${name} (${durationMs}ms): ${err.message || String(err)}`);
  }
}

async function main() {
  console.log('\n===============================================================');
  console.log(' PROOFHIRE END-TO-END AUTOMATION & INTEGRATION TEST RUNNER');
  console.log('===============================================================\n');

  const API_URL = 'http://localhost:4000/api';
  const AI_URL = 'http://localhost:8000';
  const RPC_URL = 'http://127.0.0.1:8545';

  let studentToken = '';
  let recruiterToken = '';
  let institutionToken = '';
  let adminToken = '';
  let testCredId = '';
  let testDocDigest = '';
  let testJobId = '';
  let testAppId = '';

  // -------------------------------------------------------------------------
  // SUITE 1: Infrastructure Connectivity
  // -------------------------------------------------------------------------
  console.log('\n[Suite 1: Infrastructure Connectivity]');

  await runTest('Connectivity', 'Hardhat Ethereum RPC is online and responsive', async () => {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
    });
    if (!res.ok) throw new Error(`RPC returned HTTP ${res.status}`);
    const data: any = await res.json();
    if (!data.result) throw new Error('RPC did not return blockNumber');
  });

  await runTest('Connectivity', 'FastAPI AI microservice is healthy', async () => {
    const res = await fetch(`${AI_URL}/health`);
    if (!res.ok) throw new Error(`AI health returned HTTP ${res.status}`);
    const data: any = await res.json();
    if (data.status !== 'healthy') throw new Error(`Unexpected AI status: ${JSON.stringify(data)}`);
  });

  await runTest('Connectivity', 'NestJS REST API health endpoint is healthy', async () => {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error(`API health returned HTTP ${res.status}`);
    const data: any = await res.json();
    if (data.status !== 'ok') throw new Error(`Unexpected API status: ${JSON.stringify(data)}`);
  });

  // -------------------------------------------------------------------------
  // SUITE 2: Authentication, Authorization & Role Boundaries
  // -------------------------------------------------------------------------
  console.log('\n[Suite 2: Authentication & Role Enforcement]');

  await runTest('Auth', 'Student seed authentication returns valid JWT', async () => {
    const res = await fetch(`${API_URL}/auth/seed-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'STUDENT' }),
    });
    if (!res.ok) throw new Error(`Student seed login failed with status ${res.status}`);
    const data: any = await res.json();
    studentToken = data.accessToken;
    if (!studentToken || data.user?.role !== 'STUDENT') throw new Error('Invalid student token payload');
  });

  await runTest('Auth', 'Recruiter seed authentication returns valid JWT', async () => {
    const res = await fetch(`${API_URL}/auth/seed-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'RECRUITER' }),
    });
    if (!res.ok) throw new Error(`Recruiter seed login failed with status ${res.status}`);
    const data: any = await res.json();
    recruiterToken = data.accessToken;
    if (!recruiterToken || data.user?.role !== 'RECRUITER') throw new Error('Invalid recruiter token payload');
  });

  await runTest('Auth', 'Institution seed authentication returns valid JWT', async () => {
    const res = await fetch(`${API_URL}/auth/seed-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'INSTITUTION' }),
    });
    if (!res.ok) throw new Error(`Institution seed login failed with status ${res.status}`);
    const data: any = await res.json();
    institutionToken = data.accessToken;
    if (!institutionToken || data.user?.role !== 'INSTITUTION') throw new Error('Invalid institution token payload');
  });

  await runTest('Auth', 'SuperAdmin seed authentication returns valid JWT', async () => {
    const res = await fetch(`${API_URL}/auth/seed-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'ADMIN' }),
    });
    if (!res.ok) throw new Error(`Admin seed login failed with status ${res.status}`);
    const data: any = await res.json();
    adminToken = data.accessToken;
    if (!adminToken || data.user?.role !== 'ADMIN') throw new Error('Invalid admin token payload');
  });

  await runTest('Security', 'Student attempting admin endpoints is rejected with HTTP 403 Forbidden', async () => {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, received ${res.status}`);
  });

  await runTest('Security', 'Unauthenticated request to protected endpoint is rejected with HTTP 401', async () => {
    const res = await fetch(`${API_URL}/credentials/my`);
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, received ${res.status}`);
  });

  // -------------------------------------------------------------------------
  // SUITE 3: AI Resume Intelligence & Scoring Rubrics
  // -------------------------------------------------------------------------
  console.log('\n[Suite 3: AI Resume Intelligence & Rubrics]');

  await runTest('AI', 'FastAPI direct endpoint analyzes resume text with 100-point rubric', async () => {
    const payload = {
      rawText: 'Alex Rivera, Stanford CS Graduate 2025. Skills: TypeScript, Solidity, PostgreSQL, Distributed Systems, Python.',
      verifiedSkills: ['Solidity', 'TypeScript'],
    };
    const res = await fetch(`${AI_URL}/api/v1/resumes/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`AI parse failed with status ${res.status}`);
    const data: any = await res.json();
    if (typeof data.totalScore !== 'number') throw new Error('Missing totalScore');
    if (!data.humanDecisionSupportNotice) throw new Error('Missing responsible AI human decision notice');
    if (typeof data.verifiedBoostApplied !== 'number') throw new Error('Missing verifiedBoostApplied');
  });

  await runTest('AI', 'FastAPI direct endpoint matches candidate to job requirements', async () => {
    const payload = {
      candidateSkills: ['TypeScript', 'Solidity', 'PostgreSQL', 'Docker'],
      requiredSkills: ['TypeScript', 'Solidity'],
      preferredSkills: ['PostgreSQL', 'Docker'],
      verifiedSkills: ['TypeScript', 'Solidity'],
      candidateExperienceYears: 3,
    };
    const res = await fetch(`${AI_URL}/api/v1/jobs/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`AI match failed with status ${res.status}`);
    const data: any = await res.json();
    if (typeof data.overallMatchScore !== 'number' || data.overallMatchScore < 70) {
      throw new Error(`Unexpected match score: ${data.overallMatchScore}`);
    }
    if (!data.fairnessNotice) throw new Error('Missing fairnessNotice');
    if (!data.componentScores) throw new Error('Missing componentScores');
  });

  await runTest('AI', 'NestJS API gateway proxies resume analysis request with verified credential boost', async () => {
    const res = await fetch(`${API_URL}/ai/resumes/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        rawText: 'Senior Full Stack Engineer with 4 years building decentralized registries, React, Node.js, and Smart Contracts.',
        verifiedSkills: ['Smart Contracts'],
      }),
    });
    if (!res.ok) throw new Error(`NestJS AI proxy failed with status ${res.status}`);
    const data: any = await res.json();
    if (typeof data.totalScore !== 'number') throw new Error('Proxy returned invalid score structure');
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Blockchain Credential Issuance, Verification & Revocation
  // -------------------------------------------------------------------------
  console.log('\n[Suite 4: Blockchain Credential Issuance, Verification & Revocation]');

  await runTest('Blockchain', 'Authorized institution issues credential anchored on Ethereum smart contract', async () => {
    const res = await fetch(`${API_URL}/credentials/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${institutionToken}`,
      },
      body: JSON.stringify({
        title: 'B.S. in Cryptographic Engineering',
        recipientName: 'Alex Rivera',
        recipientEmail: 'student@proofhire.io',
        skills: ['Solidity', 'Zero Knowledge', 'Distributed Systems'],
        gradeOrScore: 'Summa Cum Laude (3.95)',
      }),
    });
    if (!res.ok) throw new Error(`Credential issuance failed with status ${res.status}`);
    const data: any = await res.json();
    if (!data.credentialId || !data.txHash) throw new Error('Missing transaction confirmation hash');
    testCredId = data.credentialId;
    testDocDigest = data.credential.documentDigest;
    if (!testCredId || !testDocDigest) throw new Error('Missing issued credentialId or documentDigest');
  });

  await runTest('Blockchain', 'Public visitor verifies credential against smart contract (Status: VERIFIED)', async () => {
    const res = await fetch(`${API_URL}/credentials/${testCredId}/verify`);
    if (!res.ok) throw new Error(`Verification endpoint returned status ${res.status}`);
    const data: any = await res.json();
    if (data.verificationStatus !== 'VERIFIED' || !data.isValid) {
      throw new Error(`Expected VERIFIED, got ${data.verificationStatus}`);
    }
    if (!data.blockchainConfirmed) throw new Error('blockchainConfirmed must be true');
    if (data.onChainDigest !== testDocDigest) throw new Error('On-chain digest does not match issued digest');
  });

  await runTest('Blockchain', 'Verification with forged document digest returns DOCUMENT_MISMATCH', async () => {
    const forgedDigest = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const res = await fetch(`${API_URL}/credentials/${testCredId}/verify?digest=${forgedDigest}`);
    if (!res.ok) throw new Error(`Verification endpoint returned status ${res.status}`);
    const data: any = await res.json();
    if (data.verificationStatus !== 'DOCUMENT_MISMATCH' || data.isValid) {
      throw new Error(`Expected DOCUMENT_MISMATCH, got ${data.verificationStatus}`);
    }
  });

  await runTest('Blockchain', 'Verification of non-existent credential returns NOT_FOUND', async () => {
    const res = await fetch(`${API_URL}/credentials/NON-EXISTENT-ID-99999/verify`);
    if (!res.ok) throw new Error(`Verification endpoint returned status ${res.status}`);
    const data: any = await res.json();
    if (data.verificationStatus !== 'NOT_FOUND' || data.isValid) {
      throw new Error(`Expected NOT_FOUND, got ${data.verificationStatus}`);
    }
  });

  await runTest('Blockchain', 'Authorized institution revokes credential on-chain with audit reason', async () => {
    const res = await fetch(`${API_URL}/credentials/${testCredId}/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${institutionToken}`,
      },
      body: JSON.stringify({
        reason: 'Post-graduation administrative record consolidation',
      }),
    });
    if (!res.ok) throw new Error(`Revocation failed with status ${res.status}`);
    const data: any = await res.json();
    if (data.status !== 'REVOKED') {
      throw new Error(`Expected status REVOKED, got ${data.status}`);
    }
  });

  await runTest('Blockchain', 'Subsequent verification of revoked credential returns REVOKED and displays audit reason', async () => {
    const res = await fetch(`${API_URL}/credentials/${testCredId}/verify`);
    if (!res.ok) throw new Error(`Verification endpoint returned status ${res.status}`);
    const data: any = await res.json();
    if (data.verificationStatus !== 'REVOKED' || data.isValid) {
      throw new Error(`Expected REVOKED, got ${data.verificationStatus}`);
    }
    if (!data.revocationReason) throw new Error('Missing revocation reason');
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Recruitment Pipeline
  // -------------------------------------------------------------------------
  console.log('\n[Suite 5: Recruitment Pipeline]');

  await runTest('Recruitment', 'Recruiter creates new job requisition', async () => {
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({
        title: 'Lead Zero Knowledge Cryptographer',
        companyName: 'Aether Labs',
        department: 'Cryptographic Protocols',
        location: 'San Francisco, CA (Hybrid)',
        salaryMin: 180000,
        salaryMax: 240000,
        jobType: 'FULL_TIME',
        experienceLevel: 'SENIOR',
        requiredSkills: ['Solidity', 'Zero Knowledge', 'Distributed Systems'],
        preferredSkills: ['Rust', 'PyTorch'],
        description: 'Design and audit next-generation zero knowledge verification circuits.',
      }),
    });
    if (!res.ok) throw new Error(`Job creation failed with status ${res.status}`);
    const data: any = await res.json();
    testJobId = data.id;
    if (!testJobId) throw new Error('Created job missing ID');
  });

  await runTest('Recruitment', 'Student applies to job with verified credential proof', async () => {
    const res = await fetch(`${API_URL}/applications/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        jobId: testJobId,
        coverLetter: 'I hold an on-chain verified degree in Cryptographic Engineering.',
      }),
    });
    if (!res.ok) throw new Error(`Application failed with status ${res.status}`);
    const data: any = await res.json();
    testAppId = data.id;
    if (!testAppId) throw new Error('Submitted application missing ID');
    if (!data.aiMatchScore || data.aiMatchScore <= 0) throw new Error('AI match score was not generated for application');
  });

  await runTest('Recruitment', 'Duplicate job application by same student is rejected with HTTP 409 Conflict', async () => {
    const res = await fetch(`${API_URL}/applications/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        jobId: testJobId,
        coverLetter: 'Second application attempt to test idempotency.',
      }),
    });
    if (res.status !== 409) throw new Error(`Expected 409 Conflict for duplicate application, got ${res.status}`);
  });

  await runTest('Recruitment', 'Recruiter reviews pipeline and sees candidate AI match and verified proofs', async () => {
    const res = await fetch(`${API_URL}/applications/recruiter?jobId=${testJobId}`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    if (!res.ok) throw new Error(`Fetching applications failed with status ${res.status}`);
    const data: any = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Expected at least 1 applicant in pipeline');
    const applicant = data.find((a: any) => a.id === testAppId) || data[0];
    if (typeof applicant.aiMatchScore !== 'number') throw new Error('Missing applicant AI match score');
  });

  await runTest('Recruitment', 'Recruiter updates candidate application status to SHORTLISTED', async () => {
    const res = await fetch(`${API_URL}/applications/${testAppId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({ status: 'SHORTLISTED', notes: 'Verified Stanford degree on chain.' }),
    });
    if (!res.ok) throw new Error(`Status update failed with status ${res.status}`);
    const data: any = await res.json();
    if (data.status !== 'SHORTLISTED') throw new Error(`Expected SHORTLISTED, got ${data.status}`);
  });

  // -------------------------------------------------------------------------
  // SUITE 6: Failure & Security Enforcement
  // -------------------------------------------------------------------------
  console.log('\n[Suite 6: Failure & Security Enforcement]');

  await runTest('Security', 'Student attempting to issue credentials is rejected with HTTP 403', async () => {
    const res = await fetch(`${API_URL}/credentials/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Self-issued Degree',
        recipientName: 'Attacker',
      }),
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, received ${res.status}`);
  });

  await runTest('Security', 'Student attempting to update recruiter application status is rejected with HTTP 403', async () => {
    const res = await fetch(`${API_URL}/applications/${testAppId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ status: 'SELECTED' }),
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, received ${res.status}`);
  });

  await runTest('Security', 'Malformed or invalid JWT is rejected with HTTP 401 Unauthorized', async () => {
    const res = await fetch(`${API_URL}/credentials/my`, {
      headers: { Authorization: 'Bearer this.is.a.forged.jwt.token' },
    });
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, received ${res.status}`);
  });

  await runTest('Security', 'Duplicate revocation of already-revoked credential is rejected with HTTP 400', async () => {
    const res = await fetch(`${API_URL}/credentials/${testCredId}/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${institutionToken}`,
      },
      body: JSON.stringify({ reason: 'Second revocation attempt' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, received ${res.status}`);
  });

  // -------------------------------------------------------------------------
  // FINAL REPORT
  // -------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n===============================================================');
  console.log(' END-TO-END AUTOMATION SUMMARY');
  console.log('===============================================================');
  console.log(`Total Scenarios Tested: ${total}`);
  console.log(`Passed:                 ${passed} (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`Failed:                 ${failed}`);
  console.log('===============================================================\n');

  if (failed > 0) {
    console.error('FAILED TESTS:');
    results.filter((r) => !r.passed).forEach((r) => {
      console.error(`- [${r.suite}] ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('ALL END-TO-END SCENARIOS COMPLETED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
