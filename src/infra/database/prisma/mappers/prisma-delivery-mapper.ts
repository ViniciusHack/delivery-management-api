import { Delivery } from '@/domain/deliveries/entities/delivery';
import { Prisma, Order as PrismaDelivery } from '@prisma/client';

export class PrismaDeliveryMapper {
  static toDomain(delivery: PrismaDelivery): Delivery {
    if (delivery.stage === 'IN_ANALYSIS') {
      throw new Error('A delivery cannot be in analysis');
    }
    return new Delivery(
      {
        addresseeId: delivery.addresseeId,
        shipperId: delivery.shipperId ?? undefined,
        stage: delivery.stage,
        updatedAt: delivery.updatedAt,
      },
      delivery.id,
    );
  }

  static toPersistence(delivery: Delivery): Prisma.OrderUncheckedCreateInput {
    return {
      id: delivery.id,
      addresseeId: delivery.addresseeId,
      shipperId: delivery.shipperId,
      stage: delivery.stage,
      updatedAt: delivery.updatedAt,
    };
  }
}
