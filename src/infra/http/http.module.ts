import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { ChangeAdminPasswordUseCase } from '@/domain/administration/use-cases/change-admin-password';
import { ChangeShipperPasswordUseCase } from '@/domain/administration/use-cases/change-shipper-password';
import { DeleteShipperUseCase } from '@/domain/administration/use-cases/delete-shipper';
import { ListShippersUseCase } from '@/domain/administration/use-cases/list-shippers';
import { RegisterAddresseeUseCase } from '@/domain/administration/use-cases/register-addressee';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { RegisterShipperUseCase } from '@/domain/administration/use-cases/register-shipper';
import { Module } from '@nestjs/common';
import { AddressesModule } from '../addresses/addresses.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller';
import { ChangeShipperPasswordController } from './controllers/change-shipper-password.controller';
import { DeleteShipperController } from './controllers/delete-shipper.controller.';
import { ListShippersController } from './controllers/list-shippers.controller';
import { RegisterAddresseeController } from './controllers/register-addressee.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { RegisterShipperController } from './controllers/register-shipper.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, AddressesModule],
  controllers: [
    RegisterAdminController,
    AuthenticateController,
    ChangeAdminPasswordController,
    RegisterShipperController,
    ListShippersController,
    DeleteShipperController,
    ChangeShipperPasswordController,
    RegisterAddresseeController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateUseCase,
    ChangeAdminPasswordUseCase,
    RegisterShipperUseCase,
    ListShippersUseCase,
    DeleteShipperUseCase,
    ChangeShipperPasswordUseCase,
    RegisterAddresseeUseCase,
  ],
})
export class HttpModule {}
