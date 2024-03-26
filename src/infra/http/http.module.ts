import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController, AuthenticateController],
  providers: [RegisterAdminUseCase, AuthenticateUseCase],
})
export class HttpModule {}
