import { Role } from '@/core/permissions';
import { Admin } from '@/domain/administration/entities/admin';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { AdminsRepository } from '@/domain/administration/repositories/admins-repository';
import { Injectable } from '@nestjs/common';
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}
  async findByCpf(cpf: Cpf) {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf: cpf.toString(),
        role: Role.Admin,
      },
    });

    return admin ? PrismaAdminMapper.toDomain(admin) : null;
  }

  async findById(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
        role: Role.Admin,
      },
    });

    return admin ? PrismaAdminMapper.toDomain(admin) : null;
  }

  async create(admin: Admin) {
    await this.prisma.user.create({
      data: PrismaAdminMapper.toPersistence(admin),
    });
  }

  async update(admin: Admin) {
    await this.prisma.user.update({
      where: {
        id: admin.id,
      },
      data: PrismaAdminMapper.toPersistence(admin),
    });
  }
}
