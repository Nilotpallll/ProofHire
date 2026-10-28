import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SeedLoginDto } from './dto/login.dto';
import { RegisterDto, AllowedPublicRole } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserRole, AccountStatus } from '@prisma/client';
import { userStore, StoredUser } from './user-store';
import { institutionsStore } from '../institutions/institutions-store';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // In-memory demo fallback store when DB is not actively reachable
  private demoAccounts = {
    STUDENT: {
      id: 'demo-student-id-001',
      email: 'student@proofhire.io',
      name: 'Alex Rivera',
      role: UserRole.STUDENT,
      status: AccountStatus.ACTIVE,
    },
    RECRUITER: {
      id: 'demo-recruiter-id-002',
      email: 'recruiter@proofhire.io',
      name: 'Sarah Chen (Aether Labs)',
      role: UserRole.RECRUITER,
      status: AccountStatus.ACTIVE,
    },
    INSTITUTION: {
      id: 'demo-institution-id-003',
      email: 'institution@proofhire.io',
      name: 'Dr. Marcus Vance (Stanford)',
      role: UserRole.INSTITUTION,
      status: AccountStatus.ACTIVE,
    },
    ADMIN: {
      id: 'demo-admin-id-004',
      email: 'admin@proofhire.io',
      name: 'ProofHire SuperAdmin',
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
    },
  };

  async register(dto: RegisterDto) {
    // 1. Role validation
    if (!Object.values(AllowedPublicRole).includes(dto.role)) {
      throw new BadRequestException('Invalid role specified. Admin accounts cannot be self-registered.');
    }

    const initialStatus =
      dto.role === AllowedPublicRole.INSTITUTION
        ? AccountStatus.PENDING_APPROVAL
        : AccountStatus.ACTIVE;

    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (existing) {
        throw new BadRequestException('A user with this email address already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          name: dto.name,
          passwordHash,
          role: dto.role as UserRole,
          status: initialStatus,
        },
      });

      // Create role profile
      if (dto.role === AllowedPublicRole.STUDENT) {
        await this.prisma.studentProfile.create({
          data: {
            userId: user.id,
            university: dto.organizationOrUniversity || 'University Partner',
          },
        });
      } else if (dto.role === AllowedPublicRole.RECRUITER) {
        await this.prisma.recruiterProfile.create({
          data: {
            userId: user.id,
            companyName: dto.organizationOrUniversity || 'Innovative Tech Corp',
          },
        });
      }

      const token = this.generateToken(user.id, user.email, user.role);

      return {
        message:
          initialStatus === AccountStatus.PENDING_APPROVAL
            ? 'Institution registration submitted and pending admin verification.'
            : 'Registration successful.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        },
        accessToken: token,
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;

      // Fallback for standalone/in-memory adapter
      const existingInStore = userStore.findByEmail(dto.email);
      if (existingInStore) {
        throw new BadRequestException('A user with this email address already exists');
      }

      const newUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const storedUser: StoredUser = {
        id: newUserId,
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
        role: dto.role as any,
        status: initialStatus as any,
        organization: dto.organizationOrUniversity,
        createdAt: new Date().toISOString(),
      };
      userStore.addUser(storedUser);

      // If registering as institution, queue for admin approval
      if (dto.role === AllowedPublicRole.INSTITUTION) {
        institutionsStore.addInstitution({
          id: `inst-${Date.now().toString().slice(-4)}`,
          name: dto.name,
          code: (dto.organizationOrUniversity || dto.name).replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8),
          website: `https://${dto.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
          status: 'PENDING',
          contactEmail: dto.email.toLowerCase(),
          logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop',
          totalIssued: 0,
          activeStudents: 0,
        });
      }

      const token = this.generateToken(newUserId, dto.email, dto.role as UserRole);
      return {
        message:
          initialStatus === AccountStatus.PENDING_APPROVAL
            ? 'Institution registration submitted and pending admin verification.'
            : 'Registration successful.',
        user: {
          id: newUserId,
          email: dto.email,
          name: dto.name,
          role: dto.role,
          status: initialStatus,
        },
        accessToken: token,
      };
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (!user) {
        // Fallback to in-memory store
        return await this.loginFromInMemory(dto);
      }

      const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (user.status === AccountStatus.SUSPENDED) {
        throw new UnauthorizedException('Account has been suspended. Contact support.');
      }

      if (user.status === AccountStatus.PENDING_APPROVAL) {
        throw new UnauthorizedException('Account is pending administrator approval before you can sign in.');
      }

      const token = this.generateToken(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        },
        accessToken: token,
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      return await this.loginFromInMemory(dto);
    }
  }

  private async loginFromInMemory(dto: LoginDto) {
    const inMemUser = userStore.findByEmail(dto.email);
    if (inMemUser) {
      const isMatch = await bcrypt.compare(dto.password, inMemUser.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (inMemUser.status === 'SUSPENDED') {
        throw new UnauthorizedException('Account has been suspended. Contact support.');
      }

      if (inMemUser.status === 'PENDING_APPROVAL') {
        throw new UnauthorizedException('Account is pending administrator approval before you can sign in.');
      }

      inMemUser.lastLogin = new Date().toISOString();
      const token = this.generateToken(inMemUser.id, inMemUser.email, inMemUser.role as UserRole);

      return {
        user: {
          id: inMemUser.id,
          email: inMemUser.email,
          name: inMemUser.name,
          role: inMemUser.role,
          status: inMemUser.status,
          organization: inMemUser.organization,
        },
        accessToken: token,
      };
    }

    // Demo account fallback check
    const demoFound = Object.values(this.demoAccounts).find(
      (acc) => acc.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (demoFound) {
      const token = this.generateToken(demoFound.id, demoFound.email, demoFound.role);
      return {
        user: demoFound,
        accessToken: token,
      };
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async seedLogin(dto: SeedLoginDto) {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED_AUTH !== 'true') {
      throw new ForbiddenException('Demonstration seed login is strictly disabled in production environments.');
    }

    const account = this.demoAccounts[dto.role];
    if (!account) {
      throw new BadRequestException('Invalid seed role');
    }

    const token = this.generateToken(account.id, account.email, account.role);

    return {
      message: `Seeded ${dto.role} authenticated successfully for demonstration.`,
      user: account,
      accessToken: token,
    };
  }

  private generateToken(userId: string, email: string, role: UserRole): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
