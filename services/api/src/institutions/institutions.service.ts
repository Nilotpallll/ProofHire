import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { institutionsStore, InstitutionRecord } from './institutions-store';
import { userStore } from '../auth/user-store';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async getInstitutions(): Promise<InstitutionRecord[]> {
    return institutionsStore.getAll();
  }

  async getInstitutionById(id: string): Promise<InstitutionRecord> {
    const inst = institutionsStore.findById(id);
    if (!inst) {
      throw new NotFoundException(`Institution with ID '${id}' not found.`);
    }
    return inst;
  }

  async getPendingInstitutions(): Promise<InstitutionRecord[]> {
    return institutionsStore.getAll().filter((i) => i.status === 'PENDING');
  }

  async approveInstitution(id: string): Promise<InstitutionRecord> {
    const inst = institutionsStore.updateStatus(id, 'APPROVED');
    if (!inst) {
      throw new NotFoundException(`Institution with ID '${id}' not found.`);
    }

    // Activate the corresponding user in userStore if present
    const user = userStore.findByEmail(inst.contactEmail) || userStore.findById(id);
    if (user && user.status === 'PENDING_APPROVAL') {
      userStore.updateStatus(user.id, 'ACTIVE');
    }

    return inst;
  }

  async rejectInstitution(id: string): Promise<InstitutionRecord> {
    const inst = institutionsStore.updateStatus(id, 'REJECTED');
    if (!inst) {
      throw new NotFoundException(`Institution with ID '${id}' not found.`);
    }

    const user = userStore.findByEmail(inst.contactEmail) || userStore.findById(id);
    if (user) {
      userStore.updateStatus(user.id, 'REJECTED');
    }

    return inst;
  }

  async suspendInstitution(id: string): Promise<InstitutionRecord> {
    const inst = institutionsStore.updateStatus(id, 'SUSPENDED');
    if (!inst) {
      throw new NotFoundException(`Institution with ID '${id}' not found.`);
    }

    const user = userStore.findByEmail(inst.contactEmail) || userStore.findById(id);
    if (user) {
      userStore.updateStatus(user.id, 'SUSPENDED');
    }

    return inst;
  }
}
