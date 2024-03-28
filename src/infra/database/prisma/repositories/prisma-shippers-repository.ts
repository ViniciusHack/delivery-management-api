import { Role } from '@/core/permissions';
import { PaginationParams } from '@/core/utils';
import { Shipper } from '@/domain/administration/entities/shipper';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { ShippersRepository } from '@/domain/administration/repositories/shippers-repository';
import { Injectable } from '@nestjs/common';
import { PrismaShipperMapper } from '../mappers/prisma-shipper-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaShippersRepository implements ShippersRepository {
  constructor(private prisma: PrismaService) {}
  async findByCpf(cpf: Cpf) {
    const shipper = await this.prisma.user.findUnique({
      where: {
        cpf: cpf.toString(),
        role: Role.Shipper,
      },
    });

    return shipper ? PrismaShipperMapper.toDomain(shipper) : null;
  }

  async findById(id: string) {
    const shipper = await this.prisma.user.findUnique({
      where: {
        id,
        role: Role.Shipper,
      },
    });

    return shipper ? PrismaShipperMapper.toDomain(shipper) : null;
  }

  async findMany({ page, perPage }: PaginationParams) {
    const shippers = await this.prisma.user.findMany({
      where: {
        role: Role.Shipper,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return shippers.map(PrismaShipperMapper.toDomain);
  }

  async create(shipper: Shipper) {
    await this.prisma.user.create({
      data: PrismaShipperMapper.toPersistence(shipper),
    });
  }

  async update(shipper: Shipper) {
    await this.prisma.user.update({
      where: {
        id: shipper.id,
      },
      data: PrismaShipperMapper.toPersistence(shipper),
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
