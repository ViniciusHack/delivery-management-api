import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { ChangeAdminPasswordUseCase } from '@/domain/administration/use-cases/change-admin-password';
import { ChangeShipperPasswordUseCase } from '@/domain/administration/use-cases/change-shipper-password';
import { DeleteAddresseeUseCase } from '@/domain/administration/use-cases/delete-addressee';
import { DeleteOrderUseCase } from '@/domain/administration/use-cases/delete-order';
import { DeleteShipperUseCase } from '@/domain/administration/use-cases/delete-shipper';
import { GetOrderUseCase } from '@/domain/administration/use-cases/get-order';
import { ListShippersUseCase } from '@/domain/administration/use-cases/list-shippers';
import { RegisterAddresseeUseCase } from '@/domain/administration/use-cases/register-addressee';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { RegisterOrderUseCase } from '@/domain/administration/use-cases/register-order';
import { RegisterShipperUseCase } from '@/domain/administration/use-cases/register-shipper';
import { ReleaseOrderForPickUpUseCase } from '@/domain/administration/use-cases/release-order-for-pick-up';
import { UpdateAddresseeUseCase } from '@/domain/administration/use-cases/update-addressee';
import { Module } from '@nestjs/common';
import { AddressesModule } from '../addresses/addresses.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller';
import { ChangeShipperPasswordController } from './controllers/change-shipper-password.controller';
import { DeleteAddresseeController } from './controllers/delete-addressee.controller';
import { DeleteOrderController } from './controllers/delete-order.controller';
import { DeleteShipperController } from './controllers/delete-shipper.controller.';
import { GetOrderController } from './controllers/get-order.controller';
import { ListShippersController } from './controllers/list-shippers.controller';
import { RegisterAddresseeController } from './controllers/register-addressee.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { RegisterOrderController } from './controllers/register-order.controller';
import { RegisterShipperController } from './controllers/register-shipper.controller';
import { ReleaseOrderForPickUpController } from './controllers/release-order-for-pick-up.controller';
import { UpdateAddresseeController } from './controllers/update-addressee.controller';

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
    DeleteAddresseeController,
    UpdateAddresseeController,
    RegisterOrderController,
    GetOrderController,
    DeleteOrderController,
    ReleaseOrderForPickUpController,
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
    DeleteAddresseeUseCase,
    UpdateAddresseeUseCase,
    RegisterOrderUseCase,
    GetOrderUseCase,
    DeleteOrderUseCase,
    ReleaseOrderForPickUpUseCase,
  ],
})
export class HttpModule {}
