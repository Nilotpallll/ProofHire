export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'RECRUITER' | 'INSTITUTION' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED';
  organization?: string;
  createdAt: string;
  lastLogin?: string;
}

class UserStoreSingleton {
  private users: Map<string, StoredUser> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaults: StoredUser[] = [
      {
        id: 'usr_student_01',
        email: 'student@proofhire.io',
        passwordHash: '$2b$10$bL2wVP1y7/7UuzgptgWULebahI.lzhQpBCKU86dHKNydouF3XnuAW',
        name: 'Alex Rivera',
        role: 'STUDENT',
        status: 'ACTIVE',
        organization: 'Stanford University',
        createdAt: '2025-01-10T08:00:00.000Z',
        lastLogin: '2025-02-18T10:14:00.000Z',
      },
      {
        id: 'usr_recruiter_01',
        email: 'recruiter@proofhire.io',
        passwordHash: '$2b$10$QVWHJrb.tkFcJ4zPlRZNo.7kuRphOAq3.CozzuKgw4qLJiVdeLcOy',
        name: 'Sarah Chen (Aether Labs)',
        role: 'RECRUITER',
        status: 'ACTIVE',
        organization: 'Aether Cryptographic Labs',
        createdAt: '2025-01-12T09:30:00.000Z',
        lastLogin: '2025-02-18T11:00:00.000Z',
      },
      {
        id: 'usr_institution_01',
        email: 'institution@proofhire.io',
        passwordHash: '$2b$10$.ErZMOYDAMMNAlCr0BZde.kJ5aY2QmDp.6ofhvkbJSOTVinesGrv2',
        name: 'Dr. Marcus Vance (Stanford)',
        role: 'INSTITUTION',
        status: 'ACTIVE',
        organization: 'Stanford School of Engineering',
        createdAt: '2025-01-05T12:00:00.000Z',
        lastLogin: '2025-02-18T08:30:00.000Z',
      },
      {
        id: 'usr_admin_01',
        email: 'admin@proofhire.io',
        passwordHash: '$2b$10$f8IRXLlYsRS/pipi5oOlVuXkVOc11WKn5Lah2W8QpStFCoK8Ee.UW',
        name: 'ProofHire SuperAdmin',
        role: 'ADMIN',
        status: 'ACTIVE',
        organization: 'ProofHire Platform Governance',
        createdAt: '2025-01-01T00:00:00.000Z',
        lastLogin: '2025-02-18T12:00:00.000Z',
      },
      {
        id: 'usr_student_02',
        email: 'maya.patel@berkeley.edu',
        passwordHash: '$2b$10$bL2wVP1y7/7UuzgptgWULebahI.lzhQpBCKU86dHKNydouF3XnuAW',
        name: 'Maya Patel',
        role: 'STUDENT',
        status: 'ACTIVE',
        organization: 'UC Berkeley',
        createdAt: '2025-01-20T14:15:00.000Z',
        lastLogin: '2025-02-17T16:20:00.000Z',
      },
      {
        id: 'usr_inst_pending',
        email: 'contact@blockchain.berkeley.edu',
        passwordHash: '$2b$10$.ErZMOYDAMMNAlCr0BZde.kJ5aY2QmDp.6ofhvkbJSOTVinesGrv2',
        name: 'UC Berkeley Blockchain Institute',
        role: 'INSTITUTION',
        status: 'PENDING_APPROVAL',
        organization: 'UC Berkeley',
        createdAt: '2025-02-14T11:00:00.000Z',
      },
    ];

    for (const u of defaults) {
      this.users.set(u.email.toLowerCase(), u);
    }
  }

  addUser(user: StoredUser): void {
    this.users.set(user.email.toLowerCase(), user);
  }

  findByEmail(email: string): StoredUser | undefined {
    return this.users.get(email.toLowerCase());
  }

  findById(id: string): StoredUser | undefined {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return undefined;
  }

  getAll(): StoredUser[] {
    return Array.from(this.users.values());
  }

  updateStatus(id: string, status: StoredUser['status']): StoredUser | undefined {
    const user = this.findById(id);
    if (user) {
      user.status = status;
      return user;
    }
    return undefined;
  }
}

export const userStore = new UserStoreSingleton();
