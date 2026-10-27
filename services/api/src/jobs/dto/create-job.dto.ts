import { IsString, IsNotEmpty, IsArray, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum JobTypeEnum {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  REMOTE = 'REMOTE',
}

export enum ExperienceLevelEnum {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Blockchain & Full-Stack Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Lead smart contract and Web3 frontend verification protocol development.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Core Platform' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'San Francisco, CA / Hybrid' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ enum: JobTypeEnum, default: JobTypeEnum.FULL_TIME })
  @IsEnum(JobTypeEnum)
  @IsOptional()
  jobType?: JobTypeEnum;

  @ApiProperty({ enum: ExperienceLevelEnum, default: ExperienceLevelEnum.MID })
  @IsEnum(ExperienceLevelEnum)
  @IsOptional()
  experienceLevel?: ExperienceLevelEnum;

  @ApiPropertyOptional({ example: 140000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryMin?: number;

  @ApiPropertyOptional({ example: 185000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryMax?: number;

  @ApiProperty({ example: ['TypeScript', 'Solidity', 'Next.js', 'PostgreSQL'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  requiredSkills: string[];

  @ApiPropertyOptional({ example: ['Docker', 'Ethers.js', 'ZK-Proofs'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredSkills?: string[];
}
