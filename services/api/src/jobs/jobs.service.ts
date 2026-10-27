import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  private demoJobs: any[] = [
    {
      id: 'job-001',
      recruiterId: 'recruiter-001',
      companyName: 'Aether Cryptographic Labs',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
      title: 'Senior Blockchain & Full-Stack Engineer',
      description: 'Lead the development of cryptographic credential verification protocols, smart contracts, and high-performance Web3 frontends.',
      department: 'Core Infrastructure',
      location: 'San Francisco, CA (Hybrid)',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      salaryMin: 145000,
      salaryMax: 190000,
      requiredSkills: ['TypeScript', 'Next.js', 'Solidity', 'PostgreSQL'],
      preferredSkills: ['NestJS', 'Docker', 'ZK-Proofs'],
      applicantsCount: 14,
      status: 'OPEN',
      createdAt: '2025-02-01T00:00:00.000Z',
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
      status: 'OPEN',
      createdAt: '2025-02-10T00:00:00.000Z',
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
      status: 'OPEN',
      createdAt: '2025-02-14T00:00:00.000Z',
    },
  ];

  async getJobs() {
    try {
      const dbJobs = await this.prisma.job.findMany({
        where: { status: 'OPEN' },
        include: { recruiter: true },
      });
      if (dbJobs.length > 0) return dbJobs;
    } catch {
      // fallback
    }
    return this.demoJobs;
  }

  async getJobById(id: string) {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id },
        include: { recruiter: true },
      });
      if (job) return job;
    } catch {
      // fallback
    }
    return this.demoJobs.find((j) => j.id === id) || this.demoJobs[0];
  }

  async createJob(data: any) {
    const newJob = {
      id: `job-${Date.now()}`,
      recruiterId: 'recruiter-001',
      companyName: 'Aether Cryptographic Labs',
      title: data.title,
      description: data.description,
      department: data.department || 'Engineering',
      location: data.location || 'Remote',
      jobType: data.jobType || 'FULL_TIME',
      experienceLevel: data.experienceLevel || 'MID',
      salaryMin: data.salaryMin || 120000,
      salaryMax: data.salaryMax || 160000,
      requiredSkills: data.requiredSkills || ['TypeScript', 'React'],
      preferredSkills: data.preferredSkills || [],
      applicantsCount: 0,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    this.demoJobs.unshift(newJob);
    return newJob;
  }
}
