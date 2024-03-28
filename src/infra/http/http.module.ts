import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { ChangeAdminPasswordUseCase } from '@/domain/administration/use-cases/change-admin-password';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { RegisterShipperUseCase } from '@/domain/administration/use-cases/register-shipper';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { RegisterShipperController } from './controllers/register-shipper.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterAdminController,
    AuthenticateController,
    ChangeAdminPasswordController,
    RegisterShipperController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateUseCase,
    ChangeAdminPasswordUseCase,
    RegisterShipperUseCase,
  ],
})
export class HttpModule {}
