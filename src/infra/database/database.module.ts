import { AdminsRepository } from '@/domain/administration/repositories/admins-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
  ],
  exports: [PrismaService, AdminsRepository],
})
export class DatabaseModule {}
