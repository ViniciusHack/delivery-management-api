import { Delivery } from '@/domain/deliveries/entities/delivery';

export function makeDelivery(override?: Partial<Delivery>): Delivery {
  return new Delivery({
    stage: 'WAITING',
    ...override,
  });
}
