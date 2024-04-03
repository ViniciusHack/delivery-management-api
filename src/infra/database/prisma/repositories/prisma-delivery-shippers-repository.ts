import { Role } from '@/core/permissions';

import { ShippersRepository } from '@/domain/deliveries/repositories/shippers-repository';
import { Injectable } from '@nestjs/common';

import { PrismaShipperMapper } from '../mappers/prisma-delivery-shipper-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDeliveryShippersRepository implements ShippersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string) {
    const shipper = await this.prisma.user.findUnique({
      where: {
        id,
        role: Role.Shipper,
      },
    });

    return shipper ? PrismaShipperMapper.toDomain(shipper) : null;
  }
}
