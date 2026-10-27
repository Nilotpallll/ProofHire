import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'student@proofhire.io' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Student123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SeedLoginDto {
  @ApiProperty({ example: 'STUDENT', enum: ['STUDENT', 'RECRUITER', 'INSTITUTION', 'ADMIN'] })
  @IsString()
  @IsNotEmpty()
  role: 'STUDENT' | 'RECRUITER' | 'INSTITUTION' | 'ADMIN';
}
