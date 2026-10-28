export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  website: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
  contactEmail: string;
  logoUrl?: string;
  verifiedAt?: string;
  totalIssued: number;
  activeStudents: number;
}

class InstitutionsStoreSingleton {
  private institutions: Map<string, InstitutionRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaults: InstitutionRecord[] = [
      {
        id: 'inst-001',
        name: 'Stanford School of Engineering',
        code: 'STANFORD-CS',
        website: 'https://engineering.stanford.edu',
        status: 'APPROVED',
        contactEmail: 'institution@proofhire.io',
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

    for (const inst of defaults) {
      this.institutions.set(inst.id, inst);
    }
  }

  getAll(): InstitutionRecord[] {
    return Array.from(this.institutions.values());
  }

  findById(id: string): InstitutionRecord | undefined {
    return this.institutions.get(id);
  }

  findByEmail(email: string): InstitutionRecord | undefined {
    for (const inst of this.institutions.values()) {
      if (inst.contactEmail.toLowerCase() === email.toLowerCase()) {
        return inst;
      }
    }
    return undefined;
  }

  addInstitution(inst: InstitutionRecord): void {
    this.institutions.set(inst.id, inst);
  }

  updateStatus(id: string, status: InstitutionRecord['status']): InstitutionRecord | undefined {
    const inst = this.institutions.get(id);
    if (inst) {
      inst.status = status;
      if (status === 'APPROVED') {
        inst.verifiedAt = new Date().toISOString();
      }
      return inst;
    }
    return undefined;
  }
}

export const institutionsStore = new InstitutionsStoreSingleton();
