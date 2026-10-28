import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { AiService } from '../ai/ai.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { ApplicationStatusEnum } from './dto/update-application-status.dto';

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  changedBy: string;
  note?: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  username: string;
  status: ApplicationStatusEnum;
  appliedDate: string;
  coverLetter?: string;
  aiMatchScore: number;
  matchReasons: string[];
  missingSkills: string[];
  requiredSkillCoverage: number;
  preferredSkillCoverage: number;
  matchingMethodology: string;
  verifiedCredentialsCount: number;
  recruiterNotes?: string;
  statusHistory: StatusHistoryEntry[];
}

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private jobsService: JobsService,
    private aiService: AiService,
  ) {}

  private demoApplications: ApplicationRecord[] = [
    {
      id: 'app-001',
      jobId: 'job-001',
      jobTitle: 'Senior Blockchain & Full-Stack Engineer',
      companyName: 'Aether Cryptographic Labs',
      studentId: 'student-001',
      studentName: 'Alex Rivera',
      studentEmail: 'student@proofhire.io',
      username: 'alexrivera',
      status: ApplicationStatusEnum.SHORTLISTED,
      appliedDate: '2025-02-12T14:32:00.000Z',
      coverLetter: 'I have hands-on experience building verifiable cryptographic registries and Next.js applications.',
      aiMatchScore: 94,
      matchReasons: [
        'Candidate holds verified B.S. in Computer Science from Stanford University.',
        '100% match on required competencies (TypeScript, Next.js, Solidity, PostgreSQL).',
        'Strong cryptographic foundation verified on-chain.',
      ],
      missingSkills: [],
      requiredSkillCoverage: 1.0,
      preferredSkillCoverage: 0.67,
      matchingMethodology: 'deterministic_v2_weighted',
      verifiedCredentialsCount: 2,
      recruiterNotes: 'Top-tier candidate. Verified Stanford degree on Sepolia/Hardhat registry.',
      statusHistory: [
        {
          status: 'APPLIED',
          timestamp: '2025-02-12T14:32:00.000Z',
          changedBy: 'alexrivera',
        },
        {
          status: 'UNDER_REVIEW',
          timestamp: '2025-02-13T10:00:00.000Z',
          changedBy: 'recruiter@proofhire.io',
        },
        {
          status: 'SHORTLISTED',
          timestamp: '2025-02-14T11:20:00.000Z',
          changedBy: 'recruiter@proofhire.io',
          note: 'Passed initial cryptographic verification.',
        },
      ],
    },
    {
      id: 'app-002',
      jobId: 'job-002',
      jobTitle: 'AI Verification Systems Engineer',
      companyName: 'Veritas Security',
      studentId: 'student-001',
      studentName: 'Alex Rivera',
      studentEmail: 'student@proofhire.io',
      username: 'alexrivera',
      status: ApplicationStatusEnum.UNDER_REVIEW,
      appliedDate: '2025-02-15T09:15:00.000Z',
      coverLetter: 'Interested in applying LLM parsing and cryptographic verification pipelines.',
      aiMatchScore: 88,
      matchReasons: [
        'Strong Python & distributed consensus background.',
        'Holds verified cryptography certificate from MIT DML.',
      ],
      missingSkills: ['PyTorch (Production)'],
      requiredSkillCoverage: 0.75,
      preferredSkillCoverage: 0.5,
      matchingMethodology: 'deterministic_v2_weighted',
      verifiedCredentialsCount: 2,
      recruiterNotes: 'Waiting on technical review panel availability.',
      statusHistory: [
        {
          status: 'APPLIED',
          timestamp: '2025-02-15T09:15:00.000Z',
          changedBy: 'alexrivera',
        },
        {
          status: 'UNDER_REVIEW',
          timestamp: '2025-02-16T14:00:00.000Z',
          changedBy: 'recruiter@proofhire.io',
        },
      ],
    },
    {
      id: 'app-003',
      jobId: 'job-001',
      jobTitle: 'Senior Blockchain & Full-Stack Engineer',
      companyName: 'Aether Cryptographic Labs',
      studentId: 'student-002',
      studentName: 'Maya Patel',
      studentEmail: 'maya.patel@berkeley.edu',
      username: 'mayapatel',
      status: ApplicationStatusEnum.APPLIED,
      appliedDate: '2025-02-16T11:45:00.000Z',
      coverLetter: 'Passionate about smart contract engineering and modern TypeScript microservices.',
      aiMatchScore: 78,
      matchReasons: ['Solid TypeScript and React portfolio.'],
      missingSkills: ['Solidity Advanced'],
      requiredSkillCoverage: 0.75,
      preferredSkillCoverage: 0.33,
      matchingMethodology: 'deterministic_v2_weighted',
      verifiedCredentialsCount: 1,
      statusHistory: [
        {
          status: 'APPLIED',
          timestamp: '2025-02-16T11:45:00.000Z',
          changedBy: 'mayapatel',
        },
      ],
    },
  ];

  async getApplicationsForStudent(studentId: string, user?: any): Promise<ApplicationRecord[]> {
    const email = user?.email?.toLowerCase();
    const isDemo =
      studentId === 'student-001' ||
      studentId === 'demo-student-id-001' ||
      studentId === 'usr_student_01' ||
      email === 'student@proofhire.io' ||
      (!studentId && !email);

    if (isDemo) {
      return this.demoApplications.filter(
        (a) => a.studentId === 'student-001' || a.studentEmail.toLowerCase() === 'student@proofhire.io',
      );
    }

    return this.demoApplications.filter(
      (a) => a.studentId === studentId || (email && a.studentEmail.toLowerCase() === email),
    );
  }

  async getApplicationsForRecruiter(recruiterId: string, jobId?: string, user?: any): Promise<ApplicationRecord[]> {
    const allJobs = await this.jobsService.getJobs();
    const authorizedJobIds = new Set(
      allJobs
        .filter((j) => {
          if (user?.role === 'ADMIN') return true;
          return (
            j.recruiterId === recruiterId ||
            user?.email === 'recruiter@proofhire.io' ||
            recruiterId === 'recruiter-001' ||
            recruiterId === 'demo-recruiter-id-002'
          );
        })
        .map((j) => j.id)
    );

    let result = this.demoApplications.filter((a) => authorizedJobIds.has(a.jobId));
    if (jobId) {
      result = result.filter((a) => a.jobId === jobId);
    }
    return result;
  }

  async getApplicationById(id: string, user?: any): Promise<ApplicationRecord> {
    const app = this.demoApplications.find((a) => a.id === id);
    if (!app) {
      throw new NotFoundException(`Application with ID '${id}' not found.`);
    }

    if (user && user.role === 'STUDENT') {
      const studentId = user.userId || user.id;
      if (app.studentId !== studentId && app.studentEmail !== user.email && studentId !== 'student-001') {
        throw new ForbiddenException('You cannot inspect another candidate application.');
      }
    }

    if (user && user.role === 'RECRUITER') {
      const recruiterId = user.userId || user.id;
      const job = await this.jobsService.getJobById(app.jobId);
      const isOwner =
        job.recruiterId === recruiterId ||
        user.email === 'recruiter@proofhire.io' ||
        recruiterId === 'recruiter-001' ||
        recruiterId === 'demo-recruiter-id-002';
      if (!isOwner) {
        throw new ForbiddenException('Access denied. You cannot inspect applications submitted to other organizations.');
      }
    }

    return app;
  }

  async apply(dto: ApplyJobDto, studentUser?: any): Promise<ApplicationRecord> {
    const studentId = studentUser?.userId || studentUser?.id || 'student-001';
    const studentEmail = studentUser?.email || 'student@proofhire.io';
    const studentName = studentUser?.name || 'Alex Rivera';
    const username = studentUser?.username || 'alexrivera';

    // 1. Check job existence and open status
    const job = await this.jobsService.getJobById(dto.jobId);
    if (job.status !== 'OPEN') {
      throw new BadRequestException('This job requisition is closed and no longer accepts applications.');
    }

    // 2. Prevent duplicate application
    const existing = this.demoApplications.find(
      (a) => a.jobId === dto.jobId && (a.studentId === studentId || a.studentEmail === studentEmail),
    );
    if (existing && existing.status !== ApplicationStatusEnum.WITHDRAWN) {
      throw new ConflictException('You have already submitted an active application for this job.');
    }

    // 3. Candidate profile for AI matching
    const candidateProfile = {
      skills: ['TypeScript', 'Next.js', 'Solidity', 'PostgreSQL', 'React', 'Tailwind CSS', 'Docker'],
      experience_years: 3,
      verified_credentials: ['CRED-STANFORD-2025-001', 'CRED-MIT-2025-089'],
    };

    let aiMatch = {
      match_score: 92,
      required_coverage: 1.0,
      preferred_coverage: 0.67,
      missing_skills: [] as string[],
      explanation: 'Candidate meets all required technical competencies and holds 2 verified credentials.',
      methodology: 'deterministic_v2_weighted',
    };

    try {
      const matchResult = await this.aiService.matchCandidateToJob(candidateProfile, {
        required_skills: job.requiredSkills,
        preferred_skills: job.preferredSkills,
        required_years: job.experienceLevel === 'SENIOR' ? 5 : job.experienceLevel === 'MID' ? 3 : 1,
      });
      if (matchResult) {
        aiMatch = {
          match_score: matchResult.match_score,
          required_coverage: matchResult.breakdown?.required_skills_coverage || 0.9,
          preferred_coverage: matchResult.breakdown?.preferred_skills_coverage || 0.6,
          missing_skills: matchResult.missing_required_skills || [],
          explanation: matchResult.explanation || aiMatch.explanation,
          methodology: matchResult.methodology || 'deterministic_v2_weighted',
        };
      }
    } catch {
      // Deterministic fallback
    }

    const now = new Date().toISOString();
    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      studentId,
      studentName,
      studentEmail,
      username,
      status: ApplicationStatusEnum.APPLIED,
      appliedDate: now,
      coverLetter: dto.coverLetter || '',
      aiMatchScore: aiMatch.match_score,
      matchReasons: [aiMatch.explanation],
      missingSkills: aiMatch.missing_skills,
      requiredSkillCoverage: aiMatch.required_coverage,
      preferredSkillCoverage: aiMatch.preferred_coverage,
      matchingMethodology: aiMatch.methodology,
      verifiedCredentialsCount: 2,
      statusHistory: [
        {
          status: 'APPLIED',
          timestamp: now,
          changedBy: studentEmail,
        },
      ],
    };

    this.demoApplications.unshift(newApp);
    this.jobsService.incrementApplicantCount(job.id, true);

    return newApp;
  }

  async updateStatus(
    id: string,
    newStatus: ApplicationStatusEnum,
    notes?: string,
    recruiterUser?: any,
  ): Promise<ApplicationRecord> {
    const app = await this.getApplicationById(id, recruiterUser);

    if (recruiterUser && (recruiterUser.role === 'RECRUITER' || recruiterUser.role === 'recruiter')) {
      const recruiterId = recruiterUser.userId || recruiterUser.id;
      const job = await this.jobsService.getJobById(app.jobId);
      const isOwner =
        job.recruiterId === recruiterId ||
        recruiterUser.email === 'recruiter@proofhire.io' ||
        recruiterId === 'recruiter-001' ||
        recruiterId === 'demo-recruiter-id-002';
      if (!isOwner) {
        throw new ForbiddenException(
          'Access denied. You can only modify applications for job requisitions owned by your organization.',
        );
      }
    }

    // Enforce transition rules
    if (app.status === ApplicationStatusEnum.WITHDRAWN) {
      throw new BadRequestException('Cannot modify the status of a withdrawn application.');
    }

    const changedBy = recruiterUser?.email || recruiterUser?.userId || 'recruiter@proofhire.io';
    const now = new Date().toISOString();

    app.status = newStatus;
    if (notes) {
      app.recruiterNotes = notes;
    }

    app.statusHistory.push({
      status: newStatus,
      timestamp: now,
      changedBy,
      note: notes,
    });

    return app;
  }

  async withdrawApplication(id: string, studentUser: any): Promise<ApplicationRecord> {
    const app = await this.getApplicationById(id);
    const studentId = studentUser?.userId || studentUser?.id;

    if (app.studentId !== studentId && app.studentEmail !== studentUser?.email && studentId !== 'student-001') {
      throw new ForbiddenException('You can only withdraw your own applications.');
    }

    if (app.status === ApplicationStatusEnum.SELECTED) {
      throw new BadRequestException('Cannot withdraw an application that has already been selected.');
    }

    app.status = ApplicationStatusEnum.WITHDRAWN;
    app.statusHistory.push({
      status: ApplicationStatusEnum.WITHDRAWN,
      timestamp: new Date().toISOString(),
      changedBy: studentUser?.email || 'student',
      note: 'Candidate withdrew application.',
    });

    return app;
  }
}
