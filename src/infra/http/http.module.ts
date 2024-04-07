import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { ChangeAdminPasswordUseCase } from '@/domain/administration/use-cases/change-admin-password';
import { ChangeShipperPasswordUseCase } from '@/domain/administration/use-cases/change-shipper-password';
import { DeleteAddresseeUseCase } from '@/domain/administration/use-cases/delete-addressee';
import { DeleteOrderUseCase } from '@/domain/administration/use-cases/delete-order';
import { DeleteShipperUseCase } from '@/domain/administration/use-cases/delete-shipper';
import { GetOrderUseCase } from '@/domain/administration/use-cases/get-order';
import { ListDeliveriesFromShipperUseCase } from '@/domain/administration/use-cases/list-deliveries-from-shipper';
import { ListOrdersFromAddresseeUseCase } from '@/domain/administration/use-cases/list-orders-from-addressee';
import { ListShippersUseCase } from '@/domain/administration/use-cases/list-shippers';
import { RegisterAddresseeUseCase } from '@/domain/administration/use-cases/register-addressee';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { RegisterOrderUseCase } from '@/domain/administration/use-cases/register-order';
import { RegisterShipperUseCase } from '@/domain/administration/use-cases/register-shipper';
import { ReleaseOrderForPickUpUseCase } from '@/domain/administration/use-cases/release-order-for-pick-up';
import { UpdateAddresseeUseCase } from '@/domain/administration/use-cases/update-addressee';
import { DeliverDeliveryUseCase } from '@/domain/deliveries/use-cases/deliver-delivery';
import { ListDeliveriesNearbyUseCase } from '@/domain/deliveries/use-cases/list-deliveries-nearby';
import { PickUpDeliveryUseCase } from '@/domain/deliveries/use-cases/pick-up-delivery';
import { ReturnDeliveryUseCase } from '@/domain/deliveries/use-cases/return-delivery';
import { UploadAndCreatePhotoUseCase } from '@/domain/deliveries/use-cases/upload-and-create-photo';
import { Module } from '@nestjs/common';
import { AddressesModule } from '../addresses/addresses.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller';
import { ChangeShipperPasswordController } from './controllers/change-shipper-password.controller';
import { DeleteAddresseeController } from './controllers/delete-addressee.controller';
import { DeleteOrderController } from './controllers/delete-order.controller';
import { DeleteShipperController } from './controllers/delete-shipper.controller.';
import { DeliverDeliveryController } from './controllers/deliver-delivery.controller';
import { GetOrderController } from './controllers/get-order.controller';
import { ListDeliveriesFromShipperController } from './controllers/list-deliveries-from-shipper.controller';
import { ListDeliveriesNearbyController } from './controllers/list-deliveries-nearby.controller';
import { ListOrdersFromAddresseeController } from './controllers/list-orders-from-addressee.controller';
import { ListShippersController } from './controllers/list-shippers.controller';
import { PickUpDeliveryController } from './controllers/pick-up-delivery.controller';
import { RegisterAddresseeController } from './controllers/register-addressee.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { RegisterOrderController } from './controllers/register-order.controller';
import { RegisterShipperController } from './controllers/register-shipper.controller';
import { ReleaseOrderForPickUpController } from './controllers/release-order-for-pick-up.controller';
import { ReturnDeliveryController } from './controllers/return-delivery.controller';
import { UpdateAddresseeController } from './controllers/update-addressee.controller';
import { UploadAndCreatePhotoController } from './controllers/upload-and-create-photo.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, AddressesModule, StorageModule],
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
    ListDeliveriesFromShipperController,
    PickUpDeliveryController,
    ReturnDeliveryController,
    ListDeliveriesNearbyController,
    UploadAndCreatePhotoController,
    DeliverDeliveryController,
    ListOrdersFromAddresseeController,
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
    ListDeliveriesFromShipperUseCase,
    PickUpDeliveryUseCase,
    ReturnDeliveryUseCase,
    ListDeliveriesNearbyUseCase,
    UploadAndCreatePhotoUseCase,
    DeliverDeliveryUseCase,
    ListOrdersFromAddresseeUseCase,
  ],
})
export class HttpModule {}
