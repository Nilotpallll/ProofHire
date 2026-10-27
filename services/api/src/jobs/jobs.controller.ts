import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List active open jobs' })
  getJobs() {
    return this.jobsService.getJobs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific job' })
  getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post a new job listing (Recruiters & Admins only)' })
  createJob(@Body() data: any) {
    return this.jobsService.createJob(data);
  }
}
