import { PrismaClient, UserRole, AccountStatus, InstitutionStatus, CredentialType, CredentialStatus, JobType, ExperienceLevel, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ProofHire database seeding...');

  // Password hashes
  const studentPassword = await bcrypt.hash('Student123!', 10);
  const recruiterPassword = await bcrypt.hash('Recruiter123!', 10);
  const institutionPassword = await bcrypt.hash('Institution123!', 10);
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  // 1. Seed Users
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@proofhire.io' },
    update: {},
    create: {
      email: 'student@proofhire.io',
      name: 'Alex Rivera',
      passwordHash: studentPassword,
      role: UserRole.STUDENT,
      status: AccountStatus.ACTIVE,
    },
  });

  const recruiterUser = await prisma.user.upsert({
    where: { email: 'recruiter@proofhire.io' },
    update: {},
    create: {
      email: 'recruiter@proofhire.io',
      name: 'Sarah Chen',
      passwordHash: recruiterPassword,
      role: UserRole.RECRUITER,
      status: AccountStatus.ACTIVE,
    },
  });

  const institutionUser = await prisma.user.upsert({
    where: { email: 'institution@proofhire.io' },
    update: {},
    create: {
      email: 'institution@proofhire.io',
      name: 'Dr. Marcus Vance (Stanford)',
      passwordHash: institutionPassword,
      role: UserRole.INSTITUTION,
      status: AccountStatus.ACTIVE,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@proofhire.io' },
    update: {},
    create: {
      email: 'admin@proofhire.io',
      name: 'ProofHire SuperAdmin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });

  console.log('✅ Users seeded: Student, Recruiter, Institution, Admin');

  // 2. Institution
  const institution = await prisma.institution.upsert({
    where: { code: 'STANFORD-CS' },
    update: {},
    create: {
      name: 'Stanford School of Engineering',
      code: 'STANFORD-CS',
      website: 'https://engineering.stanford.edu',
      status: InstitutionStatus.APPROVED,
      contactEmail: 'registrar@stanford.edu',
      contactPhone: '+1-650-723-2300',
      verifiedAt: new Date('2024-01-15T00:00:00Z'),
    },
  });

  // Link institution membership
  await prisma.institutionMembership.upsert({
    where: {
      institutionId_userId: {
        institutionId: institution.id,
        userId: institutionUser.id,
      },
    },
    update: {},
    create: {
      institutionId: institution.id,
      userId: institutionUser.id,
      role: 'ADMIN',
    },
  });

  // 3. Profiles
  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      headline: 'Software Engineer & Distributed Systems Enthusiast',
      bio: 'B.S. in Computer Science with focus on cryptography, distributed consensus, and full-stack web architectures.',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2025,
      gpa: 3.92,
      githubUrl: 'https://github.com/alexrivera-demo',
      linkedinUrl: 'https://linkedin.com/in/alexrivera-demo',
      portfolioUrl: 'https://alexrivera.dev',
    },
  });

  const recruiterProfile = await prisma.recruiterProfile.upsert({
    where: { userId: recruiterUser.id },
    update: {},
    create: {
      userId: recruiterUser.id,
      companyName: 'Aether Cryptographic Labs',
      companyWebsite: 'https://aetherlabs.tech',
      designation: 'VP of Engineering Talent',
      industry: 'Decentralized Infrastructure & FinTech',
      verifiedCompany: true,
    },
  });

  // 4. Seed Skills
  const skillsList = [
    { name: 'TypeScript', slug: 'typescript', category: 'Language' },
    { name: 'React', slug: 'react', category: 'Frontend' },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend' },
    { name: 'Solidity', slug: 'solidity', category: 'Blockchain' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
    { name: 'NestJS', slug: 'nestjs', category: 'Backend' },
    { name: 'Python', slug: 'python', category: 'Language' },
  ];

  for (const s of skillsList) {
    await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  // 5. Seed Credentials
  const cred1 = await prisma.credential.upsert({
    where: { credentialId: 'CRED-STANFORD-2025-001' },
    update: {},
    create: {
      credentialId: 'CRED-STANFORD-2025-001',
      title: 'Bachelor of Science in Computer Science',
      type: CredentialType.DEGREE,
      recipientId: studentProfile.id,
      institutionId: institution.id,
      issueDate: new Date('2025-06-15'),
      status: CredentialStatus.ISSUED,
      ipfsHash: 'ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      merkleRoot: '0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29',
      txHash: '0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124',
      blockNumber: 4892110,
      gradeOrScore: 'GPA 3.92 (Summa Cum Laude)',
      skills: ['Distributed Systems', 'Data Structures', 'Cryptography', 'Full-Stack Development'],
    },
  });

  // 6. Seed Job
  const job = await prisma.job.create({
    data: {
      recruiterId: recruiterProfile.id,
      title: 'Senior Blockchain & Full-Stack Engineer',
      description: 'Join Aether Labs to build next-generation verifiable credential infrastructure and zero-knowledge identity rails.',
      department: 'Core Protocol & Platform',
      location: 'San Francisco, CA / Hybrid',
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.MID,
      salaryMin: 140000,
      salaryMax: 185000,
      requiredSkills: ['TypeScript', 'Next.js', 'Solidity', 'PostgreSQL'],
      preferredSkills: ['NestJS', 'Docker', 'Cryptography'],
      status: 'OPEN',
    },
  });

  // 7. Seed Application
  await prisma.application.create({
    data: {
      jobId: job.id,
      studentProfileId: studentProfile.id,
      status: ApplicationStatus.SHORTLISTED,
      coverLetter: 'I have hands-on experience building verifiable cryptographic registries and Next.js applications.',
      aiMatchScore: 94,
      matchReasons: [
        'Candidate holds verified B.S. in Computer Science from Stanford University.',
        '100% match on required competencies (TypeScript, Next.js, Solidity, PostgreSQL).',
        'Strong cryptographic foundation verified on-chain.'
      ],
      missingSkills: [],
    },
  });

  console.log('✅ Demo credentials, jobs, and applications seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
