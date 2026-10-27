import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { JobTypeEnum, ExperienceLevelEnum } from './dto/create-job.dto';

describe('JobsService & Ownership Checks', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: {
            job: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should list open jobs by default', async () => {
    const jobs = await service.getJobs();
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.every((j) => j.status === 'OPEN')).toBe(true);
  });

  it('should filter jobs by search query and skills', async () => {
    const jobs = await service.getJobs({ search: 'Solidity' });
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0].requiredSkills).toContain('Solidity');
  });

  it('should create a new job requisition', async () => {
    const newJob = await service.createJob(
      {
        title: 'Lead Protocol Cryptographer',
        description: 'Design and deploy zk-SNARK verifiable credential schemes.',
        department: 'Research',
        location: 'Remote',
        jobType: JobTypeEnum.FULL_TIME,
        experienceLevel: ExperienceLevelEnum.LEAD,
        salaryMin: 180000,
        salaryMax: 240000,
        requiredSkills: ['Cryptography', 'ZK-Proofs', 'Rust', 'Solidity'],
      },
      { userId: 'recruiter-001', role: 'RECRUITER' },
    );

    expect(newJob.id).toBeDefined();
    expect(newJob.title).toBe('Lead Protocol Cryptographer');
    expect(newJob.status).toBe('OPEN');
    expect(newJob.applicantsCount).toBe(0);
  });

  it('should allow job owner to close a job requisition', async () => {
    const closed = await service.closeJob('job-001', { userId: 'recruiter-001', role: 'RECRUITER' });
    expect(closed.status).toBe('CLOSED');
  });

  it('should reject unauthorized recruiter trying to edit someone elses job', async () => {
    await expect(
      service.updateJob(
        'job-003', // owned by recruiter-002
        { title: 'Hacked Title' },
        { userId: 'recruiter-malicious', role: 'RECRUITER' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow SuperAdmin to edit any job requisition', async () => {
    const updated = await service.updateJob(
      'job-003',
      { title: 'Admin Updated Title' },
      { userId: 'admin-001', role: 'ADMIN' },
    );
    expect(updated.title).toBe('Admin Updated Title');
  });
});
