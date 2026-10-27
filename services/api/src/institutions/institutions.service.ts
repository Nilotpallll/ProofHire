import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  private demoInstitutions = [
    {
      id: 'inst-001',
      name: 'Stanford School of Engineering',
      code: 'STANFORD-CS',
      website: 'https://engineering.stanford.edu',
      status: 'APPROVED',
      contactEmail: 'registrar@stanford.edu',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop',
      verifiedAt: '2024-01-15T00:00:00.000Z',
      totalIssued: 1420,
      activeStudents: 850,
    },
    {
      id: 'inst-002',
      name: 'MIT Decentralized Media Lab',
      code: 'MIT-DML',
      website: 'https://media.mit.edu',
      status: 'APPROVED',
      contactEmail: 'credentials@mit.edu',
      logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
      verifiedAt: '2024-03-20T00:00:00.000Z',
      totalIssued: 980,
      activeStudents: 520,
    },
    {
      id: 'inst-003',
      name: 'UC Berkeley Blockchain Institute',
      code: 'UCB-BC',
      website: 'https://blockchain.berkeley.edu',
      status: 'PENDING',
      contactEmail: 'contact@blockchain.berkeley.edu',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop',
      totalIssued: 0,
      activeStudents: 0,
    },
    {
      id: 'inst-004',
      name: 'ETH Zurich Cryptography Center',
      code: 'ETHZ-CRYPTO',
      website: 'https://crypto.ethz.ch',
      status: 'PENDING',
      contactEmail: 'verify@ethz.ch',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop',
      totalIssued: 0,
      activeStudents: 0,
    },
  ];

  async getInstitutions() {
    return this.demoInstitutions;
  }

  async getInstitutionById(id: string) {
    const inst = this.demoInstitutions.find((i) => i.id === id);
    if (!inst) {
      throw new NotFoundException(`Institution with ID '${id}' not found.`);
    }
    return inst;
  }

  async getPendingInstitutions() {
    return this.demoInstitutions.filter((i) => i.status === 'PENDING');
  }

  async approveInstitution(id: string) {
    const inst = this.demoInstitutions.find((i) => i.id === id);
    if (inst) {
      inst.status = 'APPROVED';
      (inst as any).verifiedAt = new Date().toISOString();
      return inst;
    }
    return { id, status: 'APPROVED' };
  }

  async rejectInstitution(id: string) {
    const inst = this.demoInstitutions.find((i) => i.id === id);
    if (inst) {
      inst.status = 'REJECTED';
      return inst;
    }
    return { id, status: 'REJECTED' };
  }

  async suspendInstitution(id: string) {
    const inst = this.demoInstitutions.find((i) => i.id === id);
    if (inst) {
      inst.status = 'SUSPENDED';
      return inst;
    }
    return { id, status: 'SUSPENDED' };
  }
}
