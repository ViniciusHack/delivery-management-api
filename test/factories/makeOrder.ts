import { Order } from '@/domain/administration/entities/order';
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeOrder(override?: Partial<Order>): Order {
  return new Order({
    addresseeId: faker.string.uuid(),
    ...override,
  });
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data?: Partial<Order>) {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPersistence(order),
    });

    return order;
  }
}
