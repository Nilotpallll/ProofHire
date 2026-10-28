import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CredentialsService } from './credentials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@proofhire/types';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Get(':id/verify')
  @ApiOperation({ summary: 'Publicly verify credential status, blockchain anchor, and document digest' })
  @ApiQuery({ name: 'digest', required: false, description: 'Optional cryptographic digest of the document to match against' })
  @ApiResponse({ status: 200, description: 'Returns explicit verification status (VERIFIED, REVOKED, DOCUMENT_MISMATCH, NOT_FOUND)' })
  async verifyPublic(
    @Param('id') id: string,
    @Query('digest') digest?: string,
    @Query('expectedDigest') expectedDigest?: string,
  ) {
    return this.credentialsService.verifyPublic(id, digest || expectedDigest);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all credentials on the registry (Authenticated users only)' })
  async getAllCredentials() {
    return this.credentialsService.getAllCredentials();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user portfolio credentials' })
  async getMyCredentials(@Request() req: any) {
    return this.credentialsService.getMyCredentials(req.user.userId);
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue a new verifiable credential (Authorized Institutions only)' })
  @ApiResponse({ status: 201, description: 'Credential successfully issued and anchored to smart contract' })
  async issueCredential(@Body() data: any, @Request() req: any) {
    return this.credentialsService.issueCredential(data, req.user);
  }

  @Post(':id/revoke')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke an issued credential with audit reason' })
  @ApiResponse({ status: 200, description: 'Credential marked as revoked on chain and in database' })
  async revokeCredential(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    return this.credentialsService.revokeCredential(id, reason || 'Administrative institutional revocation', req.user);
  }
}
