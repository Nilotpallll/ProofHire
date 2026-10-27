import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private demoApplications: any[] = [
    {
      id: 'app-001',
      jobId: 'job-001',
      jobTitle: 'Senior Blockchain & Full-Stack Engineer',
      companyName: 'Aether Cryptographic Labs',
      studentId: 'student-001',
      studentName: 'Alex Rivera',
      studentEmail: 'student@proofhire.io',
      status: 'SHORTLISTED',
      appliedDate: '2025-02-12T14:32:00.000Z',
      coverLetter: 'I have hands-on experience building verifiable cryptographic registries and Next.js applications.',
      aiMatchScore: 94,
      matchReasons: [
        'Candidate holds verified B.S. in Computer Science from Stanford University.',
        '100% match on required competencies (TypeScript, Next.js, Solidity, PostgreSQL).',
        'Strong cryptographic foundation verified on-chain.'
      ],
      missingSkills: [],
      verifiedCredentialsCount: 2,
    },
    {
      id: 'app-002',
      jobId: 'job-002',
      jobTitle: 'AI Verification Systems Engineer',
      companyName: 'Veritas Security',
      studentId: 'student-001',
      studentName: 'Alex Rivera',
      studentEmail: 'student@proofhire.io',
      status: 'UNDER_REVIEW',
      appliedDate: '2025-02-15T09:15:00.000Z',
      coverLetter: 'Interested in applying LLM parsing and cryptographic verification pipelines.',
      aiMatchScore: 88,
      matchReasons: [
        'Strong Python & distributed consensus background.',
        'Holds verified cryptography certificate from MIT DML.'
      ],
      missingSkills: ['PyTorch (Production)'],
      verifiedCredentialsCount: 2,
    },
    {
      id: 'app-003',
      jobId: 'job-001',
      jobTitle: 'Senior Blockchain & Full-Stack Engineer',
      companyName: 'Aether Cryptographic Labs',
      studentId: 'student-002',
      studentName: 'Maya Patel',
      studentEmail: 'maya.patel@berkeley.edu',
      status: 'APPLIED',
      appliedDate: '2025-02-16T11:45:00.000Z',
      coverLetter: 'Passionate about smart contract engineering and modern TypeScript microservices.',
      aiMatchScore: 78,
      matchReasons: ['Solid TypeScript and React portfolio.'],
      missingSkills: ['Solidity Advanced'],
      verifiedCredentialsCount: 1,
    },
  ];

  async getApplicationsForStudent(studentId: string) {
    return this.demoApplications.filter((a) => a.studentId === studentId || a.studentEmail === 'student@proofhire.io');
  }

  async getApplicationsForRecruiter(recruiterId: string) {
    return this.demoApplications;
  }

  async apply(data: any) {
    const newApp = {
      id: `app-${Date.now()}`,
      jobId: data.jobId,
      jobTitle: data.jobTitle || 'Senior Software Engineer',
      companyName: data.companyName || 'Innovative Web3 Labs',
      studentId: data.studentId || 'student-001',
      studentName: data.studentName || 'Alex Rivera',
      studentEmail: data.studentEmail || 'student@proofhire.io',
      status: 'APPLIED',
      appliedDate: new Date().toISOString(),
      coverLetter: data.coverLetter || '',
      aiMatchScore: 89,
      matchReasons: ['Candidate holds relevant verified credentials.'],
      missingSkills: [],
      verifiedCredentialsCount: 2,
    };
    this.demoApplications.unshift(newApp);
    return newApp;
  }

  async updateStatus(applicationId: string, status: string) {
    const app = this.demoApplications.find((a) => a.id === applicationId);
    if (app) {
      app.status = status;
      return app;
    }
    return { id: applicationId, status };
  }
}
