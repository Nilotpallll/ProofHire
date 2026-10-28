import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Intelligence')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('resumes/analyze')
  @ApiOperation({ summary: 'Analyze resume text with 100-point rubric and verified credential boosting (Authenticated)' })
  async analyzeResume(
    @Body()
    body: {
      rawText?: string;
      resumeText?: string;
      verifiedSkills?: string[];
      verifiedCredentialTitles?: string[];
    },
  ) {
    const text = body?.rawText || body?.resumeText;
    if (!text || typeof text !== 'string') {
      throw new BadRequestException('Field "rawText" or "resumeText" must be a non-empty string.');
    }
    if (text.length > 100000) {
      throw new BadRequestException('Payload exceeds maximum allowed text length of 100,000 characters.');
    }
    const skills = Array.isArray(body.verifiedSkills)
      ? body.verifiedSkills
      : Array.isArray(body.verifiedCredentialTitles)
      ? body.verifiedCredentialTitles
      : [];
    return this.aiService.analyzeResume(text, skills);
  }

  @Post('jobs/match')
  @ApiOperation({ summary: 'Match candidate skills and evidence against job requisition requirements (Authenticated)' })
  async matchJob(
    @Body() body: { candidateSkills: string[]; requiredSkills: string[]; verifiedSkills?: string[] },
  ) {
    if (!Array.isArray(body?.candidateSkills) || !Array.isArray(body?.requiredSkills)) {
      throw new BadRequestException('candidateSkills and requiredSkills must be arrays.');
    }
    if (body.candidateSkills.length > 100 || body.requiredSkills.length > 100) {
      throw new BadRequestException('Skill lists exceed maximum allowed length of 100 items.');
    }
    return this.aiService.matchJob(
      body.candidateSkills || [],
      body.requiredSkills || [],
      body.verifiedSkills || [],
    );
  }

  @Post('claims/check')
  @ApiOperation({ summary: 'Evaluate candidate resume claims against cryptographic on-chain evidence (Authenticated)' })
  async checkClaims(
    @Body() body: { claims: any[]; availableEvidence: any[] },
  ) {
    if (!Array.isArray(body?.claims) || !Array.isArray(body?.availableEvidence)) {
      throw new BadRequestException('claims and availableEvidence must be arrays.');
    }
    return this.aiService.checkClaims(body.claims || [], body.availableEvidence || []);
  }
}
