import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@proofhire/types';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List active open jobs with optional search and filters' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by title, company, or skills' })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['OPEN', 'CLOSED', 'DRAFT'] })
  getJobs(
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    return this.jobsService.getJobs({ search, department, location, status });
  }

  @Get('recruiter/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs posted by the authenticated recruiter' })
  getMyJobs(@Request() req: any) {
    return this.jobsService.getRecruiterJobs(req.user.userId || req.user.id, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific job by ID' })
  getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job requisition (Recruiters & Admins only)' })
  @ApiResponse({ status: 201, description: 'Job requisition successfully created' })
  createJob(@Body() data: CreateJobDto, @Request() req: any) {
    return this.jobsService.createJob(data, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing job requisition (Owner only)' })
  updateJob(@Param('id') id: string, @Body() data: UpdateJobDto, @Request() req: any) {
    return this.jobsService.updateJob(id, data, req.user);
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close a job requisition so it no longer accepts applications' })
  closeJob(@Param('id') id: string, @Request() req: any) {
    return this.jobsService.closeJob(id, req.user);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish or reopen a job requisition' })
  publishJob(@Param('id') id: string, @Request() req: any) {
    return this.jobsService.publishJob(id, req.user);
  }
}
