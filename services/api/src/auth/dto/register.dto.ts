import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export enum AllowedPublicRole {
  STUDENT = 'STUDENT',
  RECRUITER = 'RECRUITER',
  INSTITUTION = 'INSTITUTION',
}

export class RegisterDto {
  @ApiProperty({ example: 'student@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Alex Rivera' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'STUDENT',
    enum: AllowedPublicRole,
    description: 'Public registration allows STUDENT, RECRUITER, or INSTITUTION. ADMIN role cannot be self-assigned.',
  })
  @IsEnum(AllowedPublicRole)
  @IsNotEmpty()
  role: AllowedPublicRole;

  @ApiProperty({ example: 'Stanford University', required: false })
  @IsOptional()
  @IsString()
  organizationOrUniversity?: string;
}
