import { Order } from '@/domain/administration/entities/order';
import { Prisma, Order as PrismaOrder } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(order: PrismaOrder): Order {
    return new Order(
      {
        addresseeId: order.addresseeId,
        createdAt: order.createdAt,
        shipperId: order.shipperId ?? undefined,
        stage: order.stage,
        updatedAt: order.updatedAt,
      },
      order.id,
    );
  }

  static toPersistence(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id,
      addresseeId: order.addresseeId,
      createdAt: order.createdAt,
      shipperId: order.shipperId,
      stage: order.stage,
      updatedAt: order.updatedAt,
    };
  }
}
