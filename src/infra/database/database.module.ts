import { AddresseesRepository } from '@/domain/administration/repositories/addressees-repository';
import { AdminsRepository } from '@/domain/administration/repositories/admins-repository';
import { ShippersRepository } from '@/domain/administration/repositories/shippers-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAddresseesRepository } from './prisma/repositories/prisma-addressees-repository';
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository';
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
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    ShippersRepository,
    AddresseesRepository,
  ],
})
export class DatabaseModule {}
