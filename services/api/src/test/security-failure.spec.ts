import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsService, PublicVerificationStatus } from '../credentials/credentials.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

describe('Level 4: Failure, Security & Invariant Tests', () => {
  let credentialsService: CredentialsService;
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  const mockPrisma = {
    credential: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  };

  const mockBlockchain = {
    verifyCredentialOnChain: jest.fn(),
    computeDocumentDigest: jest.fn().mockReturnValue('0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29'),
    getContractAddress: jest.fn().mockReturnValue('0x5FbDB2315678afecb367f032d93F642f64180aa3'),
    issueCredentialOnChain: jest.fn(),
    revokeCredentialOnChain: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: BlockchainService, useValue: mockBlockchain },
      ],
    }).compile();

    credentialsService = module.get<CredentialsService>(CredentialsService);
  });

  describe('1. Blockchain RPC Outage & Zero Fake Truth Invariant', () => {
    it('Should return UNAVAILABLE and isValid=false when RPC is down, refusing to declare VERIFIED on DB alone', async () => {
      mockBlockchain.verifyCredentialOnChain.mockResolvedValue({
        isRpcLive: false,
        isValid: false,
        exists: false,
        isRevoked: false,
        digestMatches: false,
        issuer: '',
        issuedAt: 0,
      });

      const res = await credentialsService.verifyPublic('CRED-STANFORD-2025-001');
      expect(res.verificationStatus).toBe(PublicVerificationStatus.UNAVAILABLE);
      expect(res.isValid).toBe(false);
      expect(res.blockchainConfirmed).toBe(false);
      expect(res.message).toContain('never return VERIFIED based on local database records alone');
    });
  });

  describe('2. Credential Status Taxonomy & Mismatches', () => {
    it('Should return NOT_FOUND when credential ID does not exist on-chain', async () => {
      mockBlockchain.verifyCredentialOnChain.mockResolvedValue({
        isRpcLive: true,
        exists: false,
        isValid: false,
        isRevoked: false,
        digestMatches: false,
        issuer: '',
        issuedAt: 0,
      });

      const res = await credentialsService.verifyPublic('NON-EXISTENT-CRED-999');
      expect(res.verificationStatus).toBe(PublicVerificationStatus.NOT_FOUND);
      expect(res.isValid).toBe(false);
    });

    it('Should return DOCUMENT_MISMATCH when submitted digest does not match on-chain record', async () => {
      mockBlockchain.verifyCredentialOnChain.mockResolvedValue({
        isRpcLive: true,
        exists: true,
        isValid: true,
        isRevoked: false,
        digestMatches: false, // mismatch detected
        onChainDigest: '0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29',
        issuer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        issuedAt: 1700000000,
      });

      const res = await credentialsService.verifyPublic(
        'CRED-STANFORD-2025-001',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      );
      expect(res.verificationStatus).toBe(PublicVerificationStatus.DOCUMENT_MISMATCH);
      expect(res.isValid).toBe(false);
    });

    it('Should return REVOKED when credential is flagged revoked on-chain', async () => {
      mockBlockchain.verifyCredentialOnChain.mockResolvedValue({
        isRpcLive: true,
        exists: true,
        isValid: false,
        isRevoked: true,
        digestMatches: true,
        revocationReason: 'Academic breach',
        issuer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        issuedAt: 1700000000,
      });

      const res = await credentialsService.verifyPublic('REVOKED-CRED-123');
      expect(res.verificationStatus).toBe(PublicVerificationStatus.REVOKED);
      expect(res.isValid).toBe(false);
      expect(res.revocationReason).toBe('Academic breach');
    });
  });

  describe('3. Role Guard Enforcement & Boundary Defense', () => {
    const createMockExecutionContext = (userRole?: UserRole): any => ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: userRole ? { id: 'usr-1', role: userRole } : null,
        }),
      }),
    });

    it('Should grant access when user role matches required route role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
      const context = createMockExecutionContext(UserRole.ADMIN);
      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('Should reject request when user has incorrect role (e.g. STUDENT accessing ADMIN route)', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
      const context = createMockExecutionContext(UserRole.STUDENT);
      expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('Should reject unauthenticated requests when route requires roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.INSTITUTION]);
      const context = createMockExecutionContext(undefined);
      expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('Should allow open access when no roles are required on route', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
      const context = createMockExecutionContext(UserRole.STUDENT);
      expect(rolesGuard.canActivate(context)).toBe(true);
    });
  });

  describe('4. Destructive Action Defense & Duplicate Prevention', () => {
    it('Should throw NotFoundException when revoking non-existent credential', async () => {
      await expect(
        credentialsService.revokeCredential('NON_EXISTENT_ID_999', 'Reason', { id: 'inst-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('Should reject revoking an already revoked credential with BadRequestException', async () => {
      mockBlockchain.revokeCredentialOnChain.mockResolvedValue({
        success: true,
        txHash: '0xmocktx123',
        blockNumber: 489111,
      });

      // First revocation succeeds
      await credentialsService.revokeCredential('CRED-STANFORD-2025-001', 'First audit revocation', { id: 'inst-001' });

      // Second revocation attempt on same credential MUST be rejected
      await expect(
        credentialsService.revokeCredential('CRED-STANFORD-2025-001', 'Duplicate revocation attempt', { id: 'inst-001' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
