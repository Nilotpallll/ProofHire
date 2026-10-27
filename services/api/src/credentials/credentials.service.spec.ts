import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsService, PublicVerificationStatus } from './credentials.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

describe('CredentialsService & Cryptographic Verification', () => {
  let service: CredentialsService;

  const mockPrisma = {
    credential: {
      findUnique: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({}),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  };

  const mockBlockchain = {
    verifyCredentialOnChain: jest.fn().mockImplementation(async (id: string, digest?: string) => {
      const isRev = id.toLowerCase().includes('revoked');
      return {
        isValid: !isRev,
        exists: true,
        isRevoked: isRev,
        digestMatches: true,
        issuer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        issuedAt: Math.floor(Date.now() / 1000) - 3600,
        isRpcLive: true,
      };
    }),
    computeDocumentDigest: jest.fn().mockReturnValue('0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29'),
    getContractAddress: jest.fn().mockReturnValue('0x5FbDB2315678afecb367f032d93F642f64180aa3'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: BlockchainService, useValue: mockBlockchain },
      ],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
  });

  it('Should verify an authentic credential as VERIFIED', async () => {
    const res = await service.verifyPublic('CRED-STANFORD-2025-001');
    expect(res.verificationStatus).toBe(PublicVerificationStatus.VERIFIED);
    expect(res.isValid).toBe(true);
    expect(res.blockchainConfirmed).toBe(true);
    expect(res.credential.title).toContain('Computer Science');
  });

  it('Should return REVOKED status for a revoked credential', async () => {
    const res = await service.verifyPublic('REVOKED-DEMO-CRED');
    expect(res.verificationStatus).toBe(PublicVerificationStatus.REVOKED);
    expect(res.isValid).toBe(false);
    expect(res.revocationReason).toBeDefined();
  });

  it('Should return DOCUMENT_MISMATCH when document digest does not match on-chain record', async () => {
    const forgedDigest = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const res = await service.verifyPublic('CRED-STANFORD-2025-001', forgedDigest);
    expect(res.verificationStatus).toBe(PublicVerificationStatus.DOCUMENT_MISMATCH);
    expect(res.isValid).toBe(false);
  });

  it('Should issue a credential, verify it, revoke it, and confirm second verification is REVOKED', async () => {
    // 1. Issue
    const issueRes = await service.issueCredential(
      {
        title: 'Master of Science in Artificial Intelligence',
        recipientName: 'Alex Rivera',
        skills: ['Machine Learning', 'FastAPI', 'Solidity'],
      },
      { id: 'inst-001' },
    );
    expect(issueRes.credential.credentialId).toBeDefined();
    const newCredId = issueRes.credential.credentialId;

    // 2. Verify valid
    const verify1 = await service.verifyPublic(newCredId);
    expect(verify1.verificationStatus).toBe(PublicVerificationStatus.VERIFIED);
    expect(verify1.isValid).toBe(true);

    // 3. Revoke
    const revokeRes = await service.revokeCredential(
      newCredId,
      'Administrative correction of major specialization',
      { id: 'inst-001' },
    );
    expect(revokeRes.status).toBe('REVOKED');

    // 4. Verify again -> MUST return REVOKED
    const verify2 = await service.verifyPublic(newCredId);
    expect(verify2.verificationStatus).toBe(PublicVerificationStatus.REVOKED);
    expect(verify2.isValid).toBe(false);
    expect(verify2.revocationReason).toBe('Administrative correction of major specialization');
  });
});
