import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AllowedPublicRole } from './dto/register.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole, AccountStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService — Authentication & Role Enforcement Unit Tests', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    studentProfile: {
      create: jest.fn().mockResolvedValue({}),
    },
    recruiterProfile: {
      create: jest.fn().mockResolvedValue({}),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Registration & Role Boundaries', () => {
    it('Should allow valid student registration and return active status', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-001',
        email: 'alex@stanford.edu',
        name: 'Alex Rivera',
        role: UserRole.STUDENT,
        status: AccountStatus.ACTIVE,
      });

      const res = await service.register({
        name: 'Alex Rivera',
        email: 'alex@stanford.edu',
        password: 'Password123!',
        role: AllowedPublicRole.STUDENT,
        organizationOrUniversity: 'Stanford University',
      });

      expect(res.user.role).toBe(UserRole.STUDENT);
      expect(res.user.status).toBe(AccountStatus.ACTIVE);
      expect(res.accessToken).toBe('mock.jwt.token');
      expect(mockPrisma.studentProfile.create).toHaveBeenCalled();
    });

    it('Should default institution registration status to PENDING_APPROVAL', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'inst-user-001',
        email: 'dean@stanford.edu',
        name: 'Stanford School of Engineering',
        role: UserRole.INSTITUTION,
        status: AccountStatus.PENDING_APPROVAL,
      });

      const res = await service.register({
        name: 'Stanford School of Engineering',
        email: 'dean@stanford.edu',
        password: 'Password123!',
        role: AllowedPublicRole.INSTITUTION,
        organizationOrUniversity: 'Stanford University',
      });

      expect(res.user.status).toBe(AccountStatus.PENDING_APPROVAL);
      expect(res.message).toContain('pending admin verification');
    });

    it('Should strictly REJECT self-registration as ADMIN role', async () => {
      await expect(
        service.register({
          name: 'Hacker',
          email: 'hacker@proofhire.io',
          password: 'Password123!',
          role: 'ADMIN' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('Should reject registration if email is already in use', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: 'existing@proofhire.io',
      });

      await expect(
        service.register({
          name: 'Existing User',
          email: 'existing@proofhire.io',
          password: 'Password123!',
          role: AllowedPublicRole.STUDENT,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Login & Security Invariants', () => {
    it('Should authenticate user with valid credentials and return JWT', async () => {
      const hashed = await bcrypt.hash('Secret123!', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-001',
        email: 'alex@stanford.edu',
        name: 'Alex Rivera',
        passwordHash: hashed,
        role: UserRole.STUDENT,
        status: AccountStatus.ACTIVE,
      });

      const res = await service.login({
        email: 'alex@stanford.edu',
        password: 'Secret123!',
      });

      expect(res.user.id).toBe('user-001');
      expect(res.accessToken).toBe('mock.jwt.token');
    });

    it('Should reject login with invalid password', async () => {
      const hashed = await bcrypt.hash('CorrectPassword!', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-001',
        email: 'alex@stanford.edu',
        passwordHash: hashed,
        role: UserRole.STUDENT,
        status: AccountStatus.ACTIVE,
      });

      await expect(
        service.login({
          email: 'alex@stanford.edu',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should reject login if user account is SUSPENDED', async () => {
      const hashed = await bcrypt.hash('Password123!', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'suspended-user',
        email: 'badactor@proofhire.io',
        passwordHash: hashed,
        role: UserRole.STUDENT,
        status: AccountStatus.SUSPENDED,
      });

      await expect(
        service.login({
          email: 'badactor@proofhire.io',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should allow seed login for demo evaluation accounts', async () => {
      for (const role of [UserRole.STUDENT, UserRole.RECRUITER, UserRole.INSTITUTION, UserRole.ADMIN]) {
        const res = await service.seedLogin({ role });
        expect(res.user.role).toBe(role);
        expect(res.accessToken).toBe('mock.jwt.token');
      }
    });
  });
});
