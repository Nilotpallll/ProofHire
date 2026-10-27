import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { JobsService } from '../jobs/jobs.service';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { ApplicationStatusEnum } from './dto/update-application-status.dto';

describe('ApplicationsService & Lifecycle Rules', () => {
  let service: ApplicationsService;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        JobsService,
        {
          provide: AiService,
          useValue: {
            matchCandidateToJob: jest.fn().mockResolvedValue({
              match_score: 95,
              breakdown: { required_skills_coverage: 1.0, preferred_skills_coverage: 0.8 },
              missing_required_skills: [],
              explanation: 'Strong verified fit.',
              methodology: 'deterministic_v2_weighted',
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    jobsService = module.get<JobsService>(JobsService);
  });

  it('should allow student to apply for an open job', async () => {
    const app = await service.apply(
      { jobId: 'job-002', coverLetter: 'Passionate about AI verification' },
      { userId: 'student-new', email: 'student.new@stanford.edu', name: 'Jordan Lee' },
    );

    expect(app.id).toBeDefined();
    expect(app.status).toBe(ApplicationStatusEnum.APPLIED);
    expect(app.aiMatchScore).toBeGreaterThan(0);
    expect(app.statusHistory.length).toBe(1);
  });

  it('should reject application if candidate has already applied to that job', async () => {
    // app-001 is already applied to job-001 by alexrivera (student-001)
    await expect(
      service.apply(
        { jobId: 'job-001', coverLetter: 'Duplicate application attempt' },
        { userId: 'student-001', email: 'student@proofhire.io' },
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should reject application if the target job is CLOSED', async () => {
    // Close job-002
    await jobsService.closeJob('job-002', { userId: 'recruiter-001', role: 'RECRUITER' });

    await expect(
      service.apply(
        { jobId: 'job-002' },
        { userId: 'student-brand-new', email: 'brand.new@mit.edu' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update application status and record review notes and history', async () => {
    const updated = await service.updateStatus(
      'app-003',
      ApplicationStatusEnum.SHORTLISTED,
      'Verified Berkeley credentials match required stack.',
      { email: 'recruiter@proofhire.io', role: 'RECRUITER' },
    );

    expect(updated.status).toBe(ApplicationStatusEnum.SHORTLISTED);
    expect(updated.recruiterNotes).toBe('Verified Berkeley credentials match required stack.');
    expect(updated.statusHistory.some((h) => h.status === 'SHORTLISTED')).toBe(true);
  });

  it('should allow candidate to withdraw their application', async () => {
    const withdrawn = await service.withdrawApplication('app-002', {
      userId: 'student-001',
      email: 'student@proofhire.io',
    });

    expect(withdrawn.status).toBe(ApplicationStatusEnum.WITHDRAWN);
  });

  it('should reject status modification on a withdrawn application', async () => {
    // First withdraw
    await service.withdrawApplication('app-002', {
      userId: 'student-001',
      email: 'student@proofhire.io',
    });

    // Then attempt to advance status
    await expect(
      service.updateStatus(
        'app-002',
        ApplicationStatusEnum.SHORTLISTED,
        'Trying to advance withdrawn candidate',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
