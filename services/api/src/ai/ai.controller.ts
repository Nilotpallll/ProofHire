import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI Intelligence')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('resumes/analyze')
  @ApiOperation({ summary: 'Analyze resume text with 100-point rubric and verified credential boosting' })
  async analyzeResume(@Body() body: { rawText: string; verifiedSkills?: string[] }) {
    return this.aiService.analyzeResume(body.rawText, body.verifiedSkills || []);
  }

  @Post('jobs/match')
  @ApiOperation({ summary: 'Match candidate skills and evidence against job requisition requirements' })
  async matchJob(
    @Body() body: { candidateSkills: string[]; requiredSkills: string[]; verifiedSkills?: string[] },
  ) {
    return this.aiService.matchJob(
      body.candidateSkills || [],
      body.requiredSkills || [],
      body.verifiedSkills || [],
    );
  }

  @Post('claims/check')
  @ApiOperation({ summary: 'Evaluate candidate resume claims against cryptographic on-chain evidence' })
  async checkClaims(
    @Body() body: { claims: any[]; availableEvidence: any[] },
  ) {
    return this.aiService.checkClaims(body.claims || [], body.availableEvidence || []);
  }
}
