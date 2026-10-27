import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CredentialsService } from './credentials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Get('verify/:id')
  @ApiOperation({ summary: 'Public verification of credential by hash or identifier' })
  @ApiResponse({ status: 200, description: 'Public verification status and cryptographic proofs' })
  verifyPublic(@Param('id') id: string) {
    return this.credentialsService.verifyPublic(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all public credentials in registry' })
  getAll() {
    return this.credentialsService.getAllCredentials();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List credentials belonging to current student' })
  getMyCredentials(@Request() req: any) {
    return this.credentialsService.getMyCredentials(req.user.id);
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue a verifiable credential (Authorized Institutions only)' })
  issueCredential(@Body() payload: any) {
    return this.credentialsService.issueCredential(payload);
  }

  @Post('revoke')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke an issued credential with reason' })
  revokeCredential(@Body() payload: { credentialId: string; reason: string }) {
    return this.credentialsService.revokeCredential(payload.credentialId, payload.reason);
  }
}
