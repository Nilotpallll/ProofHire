import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CredentialsModule } from './credentials/credentials.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AiModule } from './ai/ai.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    PrismaModule,
    BlockchainModule,
    AuthModule,
    CredentialsModule,
    JobsModule,
    ApplicationsModule,
    InstitutionsModule,
    AiModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
