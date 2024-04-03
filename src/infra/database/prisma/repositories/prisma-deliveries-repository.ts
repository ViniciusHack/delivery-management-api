import { Delivery } from '@/domain/deliveries/entities/delivery';
import { DeliveriesRepository } from '@/domain/deliveries/repositories/deliveries-repository';
import { Injectable } from '@nestjs/common';
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const delivery = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    return delivery ? PrismaDeliveryMapper.toDomain(delivery) : null;
  }

  async findManyNearby(params: { latitude: number; longitude: number }) {
    // const deliveries = await this.prisma.order.findMany({
    //   take: perPage,
    //   skip: (page - 1) * perPage,
    //   orderBy: {
    //     createdAt: 'asc',
    //   },
    // });

    // return deliveries.map(PrismaDeliveryMapper.toDomain);
    return [];
  }

  async update(delivery: Delivery) {
    await this.prisma.order.update({
      where: {
        id: delivery.id,
      },
      data: PrismaDeliveryMapper.toPersistence(delivery),
    });
  }
}
