import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { RegisterAdminController } from './controllers/register-admin.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController],
  providers: [RegisterAdminUseCase],
})
export class HttpModule {}
