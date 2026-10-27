import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({ example: 'job-001', description: 'Target job requisition ID' })
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @ApiPropertyOptional({ example: 'I have 3 years of production smart contract experience and verified Stanford credentials.' })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiPropertyOptional({ example: 'res-001', description: 'Optional resume ID to attach' })
  @IsString()
  @IsOptional()
  resumeId?: string;
}
