import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ApplicationStatusEnum {
  APPLIED = 'APPLIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatusEnum, example: ApplicationStatusEnum.SHORTLISTED })
  @IsEnum(ApplicationStatusEnum)
  status: ApplicationStatusEnum;

  @ApiPropertyOptional({ example: 'Strong cryptographic background and verified Stanford degree.' })
  @IsString()
  @IsOptional()
  notes?: string;
}
