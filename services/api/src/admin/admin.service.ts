import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { userStore } from '../auth/user-store';

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'RECRUITER' | 'INSTITUTION' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED';
  createdAt: string;
  lastLogin?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  entityType: string;
  entityId: string;
  result: 'SUCCESS' | 'FAILURE';
  timestamp: string;
  details?: Record<string, any>;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private demoUsers: AdminUserRecord[] = [
    {
      id: 'usr_student_01',
      email: 'student@proofhire.io',
      name: 'Alex Rivera',
      role: 'STUDENT',
      status: 'ACTIVE',
      createdAt: '2025-01-10T08:00:00.000Z',
      lastLogin: '2025-02-18T10:14:00.000Z',
    },
    {
      id: 'usr_recruiter_01',
      email: 'recruiter@proofhire.io',
      name: 'Sarah Jenkins',
      role: 'RECRUITER',
      status: 'ACTIVE',
      createdAt: '2025-01-12T09:30:00.000Z',
      lastLogin: '2025-02-18T11:00:00.000Z',
    },
    {
      id: 'usr_institution_01',
      email: 'institution@proofhire.io',
      name: 'Stanford School of Engineering Registrar',
      role: 'INSTITUTION',
      status: 'ACTIVE',
      createdAt: '2025-01-05T12:00:00.000Z',
      lastLogin: '2025-02-18T08:30:00.000Z',
    },
    {
      id: 'usr_admin_01',
      email: 'admin@proofhire.io',
      name: 'Platform SuperAdmin',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00.000Z',
      lastLogin: '2025-02-18T12:00:00.000Z',
    },
    {
      id: 'usr_student_02',
      email: 'maya.patel@berkeley.edu',
      name: 'Maya Patel',
      role: 'STUDENT',
      status: 'ACTIVE',
      createdAt: '2025-01-20T14:15:00.000Z',
      lastLogin: '2025-02-17T16:20:00.000Z',
    },
    {
      id: 'usr_inst_pending',
      email: 'contact@blockchain.berkeley.edu',
      name: 'UC Berkeley Blockchain Institute',
      role: 'INSTITUTION',
      status: 'PENDING_APPROVAL',
      createdAt: '2025-02-14T11:00:00.000Z',
    },
  ];

  private auditLogs: AuditLogEntry[] = [
    {
      id: 'audit-001',
      actor: 'admin@proofhire.io',
      role: 'ADMIN',
      action: 'APPROVE_INSTITUTION',
      entityType: 'INSTITUTION',
      entityId: 'inst-001',
      result: 'SUCCESS',
      timestamp: '2025-01-15T09:00:00.000Z',
      details: { institutionName: 'Stanford School of Engineering', code: 'STANFORD-CS' },
    },
    {
      id: 'audit-002',
      actor: 'institution@proofhire.io',
      role: 'INSTITUTION',
      action: 'ISSUE_CREDENTIAL',
      entityType: 'CREDENTIAL',
      entityId: 'CRED-STANFORD-2025-001',
      result: 'SUCCESS',
      timestamp: '2025-02-10T14:30:00.000Z',
      details: { title: 'B.S. in Computer Science', recipient: 'Alex Rivera' },
    },
    {
      id: 'audit-003',
      actor: 'recruiter@proofhire.io',
      role: 'RECRUITER',
      action: 'VERIFY_CREDENTIAL',
      entityType: 'CREDENTIAL',
      entityId: 'CRED-STANFORD-2025-001',
      result: 'SUCCESS',
      timestamp: '2025-02-12T15:00:00.000Z',
      details: { verificationStatus: 'VERIFIED', onChainDigestMatch: true },
    },
    {
      id: 'audit-004',
      actor: 'recruiter@proofhire.io',
      role: 'RECRUITER',
      action: 'UPDATE_APPLICATION_STATUS',
      entityType: 'APPLICATION',
      entityId: 'app-001',
      result: 'SUCCESS',
      timestamp: '2025-02-14T11:20:00.000Z',
      details: { newStatus: 'SHORTLISTED', candidate: 'Alex Rivera' },
    },
  ];

  async getUsers(search?: string, role?: string, status?: string): Promise<AdminUserRecord[]> {
    let result: AdminUserRecord[] = userStore.getAll();

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    if (role) {
      result = result.filter((u) => u.role === role);
    }

    if (status) {
      result = result.filter((u) => u.status === status);
    }

    return result;
  }

  async updateUserStatus(
    userId: string,
    newStatus: 'ACTIVE' | 'SUSPENDED' | 'REJECTED',
    adminUser: any,
  ): Promise<AdminUserRecord> {
    const user = userStore.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found.`);
    }

    if (user.role === 'ADMIN' && newStatus === 'SUSPENDED') {
      throw new BadRequestException('Cannot suspend a root platform administrator.');
    }

    const previousStatus = user.status;
    userStore.updateStatus(userId, newStatus);

    // Record required audit log
    this.recordAudit(
      adminUser?.email || 'admin@proofhire.io',
      adminUser?.role || 'ADMIN',
      'UPDATE_USER_STATUS',
      'USER',
      user.id,
      'SUCCESS',
      { previousStatus, newStatus, targetEmail: user.email },
    );

    return user;
  }

  async getAuditLogs(query?: string, entityType?: string, action?: string): Promise<AuditLogEntry[]> {
    let result = this.auditLogs;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.actor.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q),
      );
    }

    if (entityType) {
      result = result.filter((l) => l.entityType === entityType);
    }

    if (action) {
      result = result.filter((l) => l.action === action);
    }

    return result;
  }

  recordAudit(
    actor: string,
    role: string,
    action: string,
    entityType: string,
    entityId: string,
    result: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
    details?: Record<string, any>,
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor,
      role,
      action,
      entityType,
      entityId,
      result,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  async getAnalytics() {
    return {
      overview: {
        totalCredentialsIssued: 2400,
        totalCredentialsVerified: 1890,
        activeInstitutionsCount: 2,
        pendingInstitutionsCount: 2,
        totalJobsActive: 3,
        totalApplicationsSubmitted: 42,
        verificationRate: 98.4,
        averageAiMatchScore: 88,
      },
      health: {
        api: 'HEALTHY',
        blockchain: 'HEALTHY',
        aiService: 'HEALTHY',
        database: 'HEALTHY',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      breakdownByRole: {
        students: 310,
        recruiters: 45,
        institutions: 4,
        admins: 2,
      },
    };
  }
}
