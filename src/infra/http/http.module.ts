import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { ChangeAdminPasswordUseCase } from '@/domain/administration/use-cases/change-admin-password';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterAdminController,
    AuthenticateController,
    ChangeAdminPasswordController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateUseCase,
    ChangeAdminPasswordUseCase,
  ],
})
export class HttpModule {}
