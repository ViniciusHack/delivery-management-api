import { Delivery } from '@/domain/deliveries/entities/delivery';
import { DeliveriesRepository } from '@/domain/deliveries/repositories/deliveries-repository';
import { Injectable } from '@nestjs/common';
import { Addressee, Order } from '@prisma/client';
import { PrismaDeliveryWithAddresseeMapper } from '../mappers/prisma-deliveriy-with-addressee-mapper';
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
    const deliveries: Array<Order & Addressee> = await this.prisma.$queryRaw`
      SELECT orders.id, orders.stage, orders.updated_at as "updatedAt", addressees.city, addressees.neighborhood, addressees.zip_code as "zipCode", addressees.state, addressees.number, addressees.street, addressees.country FROM orders
      INNER JOIN addressees ON addressees.id = orders.addressee_id
      WHERE ( 6371 * acos( cos( radians(${params.latitude}) ) * cos( radians( addressees.latitude ) ) * cos( radians( addressees.longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) * sin( radians( addressees.latitude ) ) ) ) <= 10
      AND orders.stage IN ('ON_THE_WAY', 'WAITING')
    `;

    return deliveries.map(PrismaDeliveryWithAddresseeMapper.toDomain);
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
