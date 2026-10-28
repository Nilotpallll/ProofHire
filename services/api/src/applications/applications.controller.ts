import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@proofhire/types';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get current student applications with progress timeline' })
  getMyApplications(@Request() req: any) {
    return this.applicationsService.getApplicationsForStudent(req.user.userId || req.user.id, req.user);
  }

  @Get('recruiter')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get candidates applications pipeline for recruiter' })
  @ApiQuery({ name: 'jobId', required: false, description: 'Filter candidates by specific job requisition' })
  getRecruiterApplications(@Request() req: any, @Query('jobId') jobId?: string) {
    return this.applicationsService.getApplicationsForRecruiter(req.user.userId || req.user.id, jobId, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full candidate application record, AI explanation, and status history' })
  getApplicationById(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.getApplicationById(id, req.user);
  }

  @Post('apply')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Apply for an open job with verified credentials and AI match calculation' })
  @ApiResponse({ status: 201, description: 'Application submitted with AI match score generated' })
  apply(@Body() dto: ApplyJobDto, @Request() req: any) {
    return this.applicationsService.apply(dto, req.user);
  }

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Apply for an open job (alias for /apply)' })
  applyAlias(@Body() dto: ApplyJobDto, @Request() req: any) {
    return this.applicationsService.apply(dto, req.user);
  }

  @Patch(':id/status')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update candidate pipeline status and attach recruiter review notes' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @Request() req: any,
  ) {
    return this.applicationsService.updateStatus(id, dto.status, dto.notes, req.user);
  }

  @Patch(':id/withdraw')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Withdraw an active job application' })
  withdraw(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.withdrawApplication(id, req.user);
  }
}
