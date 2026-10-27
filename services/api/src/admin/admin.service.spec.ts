import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AdminService & Platform Governance', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should list users with optional filters', async () => {
    const students = await service.getUsers(undefined, 'STUDENT');
    expect(students.length).toBeGreaterThan(0);
    expect(students.every((u) => u.role === 'STUDENT')).toBe(true);
  });

  it('should update user status and record mandatory audit log', async () => {
    const updated = await service.updateUserStatus(
      'usr_student_02',
      'SUSPENDED',
      { email: 'admin@proofhire.io', role: 'ADMIN' },
    );

    expect(updated.status).toBe('SUSPENDED');

    const logs = await service.getAuditLogs(undefined, 'USER', 'UPDATE_USER_STATUS');
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].entityId).toBe('usr_student_02');
  });

  it('should reject suspension of platform root superadmin', async () => {
    await expect(
      service.updateUserStatus(
        'usr_admin_01',
        'SUSPENDED',
        { email: 'admin@proofhire.io', role: 'ADMIN' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return aggregated platform analytics and health metrics', async () => {
    const analytics = await service.getAnalytics();
    expect(analytics.overview.totalCredentialsIssued).toBeGreaterThan(0);
    expect(analytics.overview.verificationRate).toBeGreaterThan(90);
    expect(analytics.health.api).toBe('HEALTHY');
    expect(analytics.health.blockchain).toBe('HEALTHY');
  });
});
