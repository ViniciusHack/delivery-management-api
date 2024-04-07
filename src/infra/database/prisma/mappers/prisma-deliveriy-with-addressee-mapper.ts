import { Stage } from '@/domain/deliveries/entities/delivery';
import { Address } from '@/domain/deliveries/entities/value-objects/address';
import { DeliveryWithAddressee } from '@/domain/deliveries/repositories/deliveries-repository';
import { Addressee, Order } from '@prisma/client';

export class PrismaDeliveryWithAddresseeMapper {
  static toDomain(delivery: Order & Addressee): DeliveryWithAddressee {
    return {
      id: delivery.id,
      stage: delivery.stage as Stage,
      updatedAt: delivery.updatedAt ?? undefined,
      addressee: {
        address: new Address({
          ...delivery,
        }).toString(),
      },
    };
  }
}
