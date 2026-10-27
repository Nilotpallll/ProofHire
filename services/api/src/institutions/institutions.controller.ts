import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InstitutionsService } from './institutions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@proofhire/types';

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  @ApiOperation({ summary: 'List accredited educational & certification institutions' })
  getInstitutions() {
    return this.institutionsService.getInstitutions();
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get queue of pending institution verification requests (Admins only)' })
  getPendingInstitutions() {
    return this.institutionsService.getPendingInstitutions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of an accredited institution' })
  getInstitutionById(@Param('id') id: string) {
    return this.institutionsService.getInstitutionById(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve an institution for on-chain credential issuance (Admins only)' })
  approveInstitution(@Param('id') id: string) {
    return this.institutionsService.approveInstitution(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject an institution application (Admins only)' })
  rejectInstitution(@Param('id') id: string) {
    return this.institutionsService.rejectInstitution(id);
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend an institution issuance privileges (Admins only)' })
  suspendInstitution(@Param('id') id: string) {
    return this.institutionsService.suspendInstitution(id);
  }
}
