import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CredentialsModule } from './credentials/credentials.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CredentialsModule,
    JobsModule,
    ApplicationsModule,
    InstitutionsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
