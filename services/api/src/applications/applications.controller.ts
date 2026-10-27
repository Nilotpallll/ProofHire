import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get current student applications' })
  getMyApplications(@Request() req: any) {
    return this.applicationsService.getApplicationsForStudent(req.user.id);
  }

  @Get('recruiter')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get candidates applications for recruiter' })
  getRecruiterApplications(@Request() req: any) {
    return this.applicationsService.getApplicationsForRecruiter(req.user.id);
  }

  @Post('apply')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Apply for a job with verified credentials and resume' })
  apply(@Body() data: any) {
    return this.applicationsService.apply(data);
  }

  @Patch(':id/status')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update candidate application status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.applicationsService.updateStatus(id, status);
  }
}
