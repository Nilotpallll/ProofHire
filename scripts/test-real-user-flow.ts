/**
 * ProofHire Real User Lifecycle Integration Test
 * Verifies that actual users (Student, Recruiter, Institution, Admin) can:
 * 1. Register with custom credentials
 * 2. Enforce institution admin vetting (PENDING_APPROVAL -> APPROVED)
 * 3. Log in with genuine bcrypt validation & JWT issuance
 * 4. Have distinct user-isolated credentials & applications
 * 5. Issue real credentials on-chain to registered student emails
 * 6. Post real recruiter jobs and receive real student applications
 */

const API_URL = 'http://localhost:4000/api';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function main() {
  console.log('\n======================================================');
  console.log(' PROOFHIRE REAL-USER END-TO-END LIFECYCLE TEST');
  console.log('======================================================\n');

  const ts = Date.now().toString().slice(-5);
  const studentEmail = `student_${ts}@university.edu`;
  const institutionEmail = `registrar_${ts}@mit.edu`;
  const recruiterEmail = `hiring_${ts}@acme.com`;
  const password = 'StrongPassword123!';

  // Step 1: Register real student
  console.log('1. Registering new real student user...');
  const regStudent = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Elena Rostova',
      email: studentEmail,
      password: password,
      role: 'STUDENT',
      organizationOrUniversity: 'MIT Computer Science',
    }),
  });
  if (!regStudent.ok) throw new Error(`Student registration failed: ${JSON.stringify(regStudent.data)}`);
  console.log(`   ✔ Student registered: ${studentEmail} (Status: ${regStudent.data.user.status})`);

  // Step 2: Login as real student with bcrypt password
  console.log('2. Logging in as real student...');
  const loginStudent = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: studentEmail, password }),
  });
  if (!loginStudent.ok || !loginStudent.data.accessToken) {
    throw new Error(`Student login failed: ${JSON.stringify(loginStudent.data)}`);
  }
  const studentToken = loginStudent.data.accessToken;
  console.log(`   ✔ Student logged in successfully. Real JWT token issued.`);

  // Step 3: Verify student starts with clean empty credentials
  console.log('3. Checking student credentials portfolio (isolation check)...');
  const studentCreds = await request('/credentials/my', {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  if (!studentCreds.ok || !Array.isArray(studentCreds.data)) {
    throw new Error(`Failed to fetch student credentials: ${JSON.stringify(studentCreds.data)}`);
  }
  if (studentCreds.data.length !== 0) {
    throw new Error(`Data isolation leak: New student has ${studentCreds.data.length} credentials! Expected 0.`);
  }
  console.log(`   ✔ Data isolation verified: New student has 0 credentials initially.`);

  // Step 4: Register real institution
  console.log('4. Registering new institution user...');
  const regInst = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'MIT Decentralized Academy',
      email: institutionEmail,
      password: password,
      role: 'INSTITUTION',
      organizationOrUniversity: 'MIT',
    }),
  });
  if (!regInst.ok) throw new Error(`Institution registration failed: ${JSON.stringify(regInst.data)}`);
  if (regInst.data.user.status !== 'PENDING_APPROVAL') {
    throw new Error(`Security breach: Institution status is ${regInst.data.user.status}, expected PENDING_APPROVAL!`);
  }
  console.log(`   ✔ Institution registered in PENDING_APPROVAL state.`);

  // Step 5: Verify institution cannot sign in before approval
  console.log('5. Verifying unapproved institution is blocked from sign-in...');
  const loginBlocked = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: institutionEmail, password }),
  });
  if (loginBlocked.ok) {
    throw new Error('Security failure: Unapproved institution was allowed to log in!');
  }
  console.log(`   ✔ Sign-in properly blocked: "${loginBlocked.data?.message}"`);

  // Step 6: Admin logs in and approves institution
  console.log('6. Admin logs in to approve institution...');
  const adminLogin = await request('/auth/seed-login', {
    method: 'POST',
    body: JSON.stringify({ role: 'ADMIN' }),
  });
  const adminToken = adminLogin.data.accessToken;

  // Find the institution record in institutions list
  const instList = await request('/institutions');
  const targetInst = instList.data.find((i: any) => i.contactEmail?.toLowerCase() === institutionEmail.toLowerCase());
  if (!targetInst) throw new Error('Registered institution not found in institutions registry.');

  const approveRes = await request(`/institutions/${targetInst.id}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!approveRes.ok || approveRes.data.status !== 'APPROVED') {
    throw new Error(`Institution approval failed: ${JSON.stringify(approveRes.data)}`);
  }
  console.log(`   ✔ Institution approved by Admin. Status flipped to APPROVED.`);

  // Step 7: Approved institution logs in
  console.log('7. Approved institution logs in...');
  const instLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: institutionEmail, password }),
  });
  if (!instLogin.ok || !instLogin.data.accessToken) {
    throw new Error(`Approved institution login failed: ${JSON.stringify(instLogin.data)}`);
  }
  const instToken = instLogin.data.accessToken;
  console.log(`   ✔ Institution logged in. JWT token issued with INSTITUTION role.`);

  // Step 8: Institution issues real on-chain credential to student
  console.log('8. Institution issues credential anchored to smart contract for student...');
  const credId = `CRED-REAL-${ts}`;
  const issueRes = await request('/credentials/issue', {
    method: 'POST',
    headers: { Authorization: `Bearer ${instToken}` },
    body: JSON.stringify({
      credentialId: credId,
      title: 'Master of Science in Cryptography & Protocols',
      type: 'DEGREE',
      recipientName: 'Elena Rostova',
      recipientEmail: studentEmail,
      gradeOrScore: 'GPA 3.98 (Summa Cum Laude)',
      skills: ['Solidity', 'Zero Knowledge', 'Distributed Systems'],
      documentDigest: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
    }),
  });
  if (!issueRes.ok) throw new Error(`Credential issuance failed: ${JSON.stringify(issueRes.data)}`);
  console.log(`   ✔ Credential anchored on-chain. Credential ID: ${credId}, Tx: ${issueRes.data.txHash || 'confirmed'}`);

  // Step 9: Verify student now has their issued credential
  console.log('9. Checking student credentials portfolio again...');
  const studentCredsAfter = await request('/credentials/my', {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  if (!studentCredsAfter.ok || studentCredsAfter.data.length !== 1) {
    throw new Error(`Expected 1 credential in student portfolio, found: ${studentCredsAfter.data?.length}`);
  }
  console.log(`   ✔ Credential received in student portfolio: "${studentCredsAfter.data[0].title}"`);

  // Step 10: Register real recruiter and create job
  console.log('10. Registering real recruiter and creating job requisition...');
  const regRecruiter = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Marcus Vance Recruiter',
      email: recruiterEmail,
      password: password,
      role: 'RECRUITER',
      organizationOrUniversity: 'Quantum Web3 Ventures',
    }),
  });
  if (!regRecruiter.ok) throw new Error(`Recruiter registration failed: ${JSON.stringify(regRecruiter.data)}`);

  const loginRecruiter = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: recruiterEmail, password }),
  });
  const recruiterToken = loginRecruiter.data.accessToken;

  const jobRes = await request('/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${recruiterToken}` },
    body: JSON.stringify({
      title: 'Senior Cryptographic Security Architect',
      department: 'Security & Protocol',
      location: 'Remote',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      salaryMin: 180000,
      salaryMax: 240000,
      description: 'Design and audit next-generation verifiable cryptographic consensus protocols.',
      requiredSkills: ['Solidity', 'Distributed Systems', 'Cryptography'],
      preferredSkills: ['Zero Knowledge'],
    }),
  });
  if (!jobRes.ok) throw new Error(`Job creation failed: ${JSON.stringify(jobRes.data)}`);
  const createdJob = jobRes.data;
  console.log(`    ✔ Job requisition created: "${createdJob.title}" (ID: ${createdJob.id})`);

  // Step 11: Student applies to the newly created job
  console.log('11. Student applies to the real job with verified credential proof...');
  const applyRes = await request('/applications/apply', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: JSON.stringify({
      jobId: createdJob.id,
      coverLetter: 'I hold a verified Master of Science in Cryptography and have extensive Solidity experience.',
    }),
  });
  if (!applyRes.ok) throw new Error(`Job application failed: ${JSON.stringify(applyRes.data)}`);
  console.log(`    ✔ Application submitted. AI Match Score: ${applyRes.data.aiMatchScore}%`);

  // Step 12: Recruiter inspects candidate pipeline
  console.log('12. Recruiter inspects candidates application pipeline...');
  const recruiterApps = await request(`/applications/recruiter?jobId=${createdJob.id}`, {
    headers: { Authorization: `Bearer ${recruiterToken}` },
  });
  if (!recruiterApps.ok || recruiterApps.data.length === 0) {
    throw new Error('Application did not appear in recruiter pipeline!');
  }
  const app = recruiterApps.data[0];
  console.log(`    ✔ Application visible to recruiter: Applicant ${app.studentName} (${app.studentEmail}), Status: ${app.status}`);

  // Step 13: Recruiter updates application status to SHORTLISTED
  console.log('13. Recruiter updates candidate status to SHORTLISTED...');
  const statusUpdate = await request(`/applications/${app.id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${recruiterToken}` },
    body: JSON.stringify({ status: 'SHORTLISTED', note: 'Strong candidate with on-chain verified MIT credentials.' }),
  });
  if (!statusUpdate.ok || statusUpdate.data.status !== 'SHORTLISTED') {
    throw new Error(`Status update failed: ${JSON.stringify(statusUpdate.data)}`);
  }
  console.log(`    ✔ Candidate status updated to SHORTLISTED.`);

  // Step 14: Public verification against smart contract
  console.log('14. Public visitor verifies issued credential against smart contract...');
  const publicVerify = await request(`/credentials/${credId}/verify`);
  if (!publicVerify.ok || publicVerify.data.verificationStatus !== 'VERIFIED') {
    throw new Error(`Public verification failed: ${JSON.stringify(publicVerify.data)}`);
  }
  console.log(`    ✔ Public verification confirmed: Status=${publicVerify.data.verificationStatus}, Valid=${publicVerify.data.isValid}, IssuerVerified=${publicVerify.data.issuerVerified}`);

  console.log('\n======================================================');
  console.log(' ALL 14 REAL-USER LIFECYCLE TESTS PASSED (100%)');
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\n❌ TEST FAILED:', err.message || err);
  process.exit(1);
});
