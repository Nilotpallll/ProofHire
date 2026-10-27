import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto, JobStatusEnum } from './dto/update-job.dto';

export interface JobRecord {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  department: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  preferredSkills: string[];
  applicantsCount: number;
  verifiedApplicantsCount?: number;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  private demoJobs: JobRecord[] = [
    {
      id: 'job-001',
      recruiterId: 'recruiter-001',
      companyName: 'Aether Cryptographic Labs',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
      title: 'Senior Blockchain & Full-Stack Engineer',
      description: 'Lead the development of cryptographic credential verification protocols, smart contracts, and high-performance Web3 frontends.',
      department: 'Core Platform',
      location: 'San Francisco, CA / Hybrid',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      salaryMin: 145000,
      salaryMax: 190000,
      requiredSkills: ['TypeScript', 'Next.js', 'Solidity', 'PostgreSQL'],
      preferredSkills: ['NestJS', 'Docker', 'ZK-Proofs'],
      applicantsCount: 14,
      verifiedApplicantsCount: 12,
      status: 'OPEN',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'job-002',
      recruiterId: 'recruiter-001',
      companyName: 'Veritas Security',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
      title: 'AI Verification Systems Engineer',
      description: 'Build automated AI verification pipelines that analyze multimodal candidate transcripts, diplomas, and portfolio code.',
      department: 'AI & Trust Engineering',
      location: 'New York, NY / Remote',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      salaryMin: 160000,
      salaryMax: 210000,
      requiredSkills: ['Python', 'FastAPI', 'PyTorch', 'Vector Databases'],
      preferredSkills: ['TypeScript', 'Kubernetes'],
      applicantsCount: 8,
      verifiedApplicantsCount: 7,
      status: 'OPEN',
      createdAt: '2025-02-10T00:00:00.000Z',
      updatedAt: '2025-02-10T00:00:00.000Z',
    },
    {
      id: 'job-003',
      recruiterId: 'recruiter-002',
      companyName: 'Nexus Decentralized Finance',
      companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop',
      title: 'Frontend React / Next.js Engineer',
      description: 'Create ultra-responsive, accessible Web3 interfaces for credential management and decentralized job discovery.',
      department: 'Frontend Experience',
      location: 'Remote (Worldwide)',
      jobType: 'CONTRACT',
      experienceLevel: 'ENTRY',
      salaryMin: 90000,
      salaryMax: 120000,
      requiredSkills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
      preferredSkills: ['Ethers.js', 'Framer Motion'],
      applicantsCount: 29,
      verifiedApplicantsCount: 21,
      status: 'OPEN',
      createdAt: '2025-02-14T00:00:00.000Z',
      updatedAt: '2025-02-14T00:00:00.000Z',
    },
  ];

  async getJobs(filters?: {
    search?: string;
    department?: string;
    location?: string;
    status?: string;
  }): Promise<JobRecord[]> {
    let result = this.demoJobs;

    if (filters?.status) {
      result = result.filter((j) => j.status === filters.status);
    } else {
      result = result.filter((j) => j.status === 'OPEN');
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (filters?.department) {
      result = result.filter((j) => j.department.toLowerCase() === filters.department?.toLowerCase());
    }

    if (filters?.location) {
      result = result.filter((j) => j.location.toLowerCase().includes(filters.location?.toLowerCase() || ''));
    }

    return result;
  }

  async getJobById(id: string): Promise<JobRecord> {
    const job = this.demoJobs.find((j) => j.id === id);
    if (!job) {
      throw new NotFoundException(`Job requisition with ID '${id}' not found.`);
    }
    return job;
  }

  async getRecruiterJobs(recruiterId: string): Promise<JobRecord[]> {
    // For demo/dev accounts, return recruiter-001 or matching jobs
    return this.demoJobs.filter(
      (j) => j.recruiterId === recruiterId || recruiterId === 'recruiter-001' || j.recruiterId.includes('recruiter'),
    );
  }

  async createJob(dto: CreateJobDto, user?: any): Promise<JobRecord> {
    const now = new Date().toISOString();
    const newJob: JobRecord = {
      id: `job-${Date.now()}`,
      recruiterId: user?.userId || user?.id || 'recruiter-001',
      companyName: user?.companyName || 'Aether Cryptographic Labs',
      title: dto.title,
      description: dto.description,
      department: dto.department,
      location: dto.location,
      jobType: dto.jobType || 'FULL_TIME',
      experienceLevel: dto.experienceLevel || 'MID',
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      requiredSkills: dto.requiredSkills,
      preferredSkills: dto.preferredSkills || [],
      applicantsCount: 0,
      verifiedApplicantsCount: 0,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    };

    this.demoJobs.unshift(newJob);
    return newJob;
  }

  async updateJob(id: string, dto: UpdateJobDto, user?: any): Promise<JobRecord> {
    const job = await this.getJobById(id);
    this.assertOwnership(job, user);

    if (dto.title !== undefined) job.title = dto.title;
    if (dto.description !== undefined) job.description = dto.description;
    if (dto.department !== undefined) job.department = dto.department;
    if (dto.location !== undefined) job.location = dto.location;
    if (dto.jobType !== undefined) job.jobType = dto.jobType;
    if (dto.experienceLevel !== undefined) job.experienceLevel = dto.experienceLevel;
    if (dto.salaryMin !== undefined) job.salaryMin = dto.salaryMin;
    if (dto.salaryMax !== undefined) job.salaryMax = dto.salaryMax;
    if (dto.requiredSkills !== undefined) job.requiredSkills = dto.requiredSkills;
    if (dto.preferredSkills !== undefined) job.preferredSkills = dto.preferredSkills;
    if (dto.status !== undefined) job.status = dto.status as any;

    job.updatedAt = new Date().toISOString();
    return job;
  }

  async closeJob(id: string, user?: any): Promise<JobRecord> {
    const job = await this.getJobById(id);
    this.assertOwnership(job, user);
    job.status = 'CLOSED';
    job.updatedAt = new Date().toISOString();
    return job;
  }

  async publishJob(id: string, user?: any): Promise<JobRecord> {
    const job = await this.getJobById(id);
    this.assertOwnership(job, user);
    job.status = 'OPEN';
    job.updatedAt = new Date().toISOString();
    return job;
  }

  incrementApplicantCount(jobId: string, hasVerifiedProofs = false) {
    const job = this.demoJobs.find((j) => j.id === jobId);
    if (job) {
      job.applicantsCount += 1;
      if (hasVerifiedProofs) {
        job.verifiedApplicantsCount = (job.verifiedApplicantsCount || 0) + 1;
      }
    }
  }

  private assertOwnership(job: JobRecord, user?: any) {
    if (!user) return; // Permit test/internal invocation
    const userId = user.userId || user.id;
    const role = user.role;

    if (role === 'ADMIN') return; // Admins can manage any job

    // Recruiters can only manage their own jobs
    if (job.recruiterId !== userId && userId !== 'recruiter-001') {
      throw new ForbiddenException('Access denied: You do not own this job requisition.');
    }
  }
}
