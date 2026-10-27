import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@proofhire/types';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Search and filter registered users across all roles (Admin only)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search name or email' })
  @ApiQuery({ name: 'role', required: false, enum: ['STUDENT', 'RECRUITER', 'INSTITUTION', 'ADMIN'] })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'REJECTED'] })
  getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers(search, role, status);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user account status with mandatory audit log (Admin only)' })
  @ApiResponse({ status: 200, description: 'User account status updated and audited' })
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED',
    @Request() req: any,
  ) {
    return this.adminService.updateUserStatus(id, status, req.user);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Search immutable platform security and action audit logs (Admin only)' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'action', required: false })
  getAuditLogs(
    @Query('query') query?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAuditLogs(query, entityType, action);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get aggregate platform metrics, verification throughput, and health (Admin only)' })
  getAnalytics() {
    return this.adminService.getAnalytics();
  }
}
