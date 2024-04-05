import { AddresseesRepository } from '@/domain/administration/repositories/addressees-repository';
import { AdminsRepository } from '@/domain/administration/repositories/admins-repository';
import { OrdersRepository } from '@/domain/administration/repositories/orders-repository';
import { ShippersRepository } from '@/domain/administration/repositories/shippers-repository';
import { DeliveriesRepository } from '@/domain/deliveries/repositories/deliveries-repository';
import { PhotosRepository } from '@/domain/deliveries/repositories/photos-repository';
import { ShippersRepository as DeliveryShippersRepository } from '@/domain/deliveries/repositories/shippers-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAddresseesRepository } from './prisma/repositories/prisma-addressees-repository';
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository';
import { PrismaDeliveriesRepository } from './prisma/repositories/prisma-deliveries-repository';
import { PrismaDeliveryShippersRepository } from './prisma/repositories/prisma-delivery-shippers-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { PrismaPhotosRepository } from './prisma/repositories/prisma-photos-repository';
import { PrismaShippersRepository } from './prisma/repositories/prisma-shippers-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: ShippersRepository,
      useClass: PrismaShippersRepository,
    },
    {
      provide: AddresseesRepository,
      useClass: PrismaAddresseesRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: DeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
    {
      provide: DeliveryShippersRepository,
      useClass: PrismaDeliveryShippersRepository,
    },
    {
      provide: PhotosRepository,
      useClass: PrismaPhotosRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    ShippersRepository,
    AddresseesRepository,
    OrdersRepository,
    DeliveriesRepository,
    DeliveryShippersRepository,
    PhotosRepository,
  ],
})
export class DatabaseModule {}
