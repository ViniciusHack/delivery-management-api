import { Delivery } from '@/domain/deliveries/entities/delivery';
import { faker } from '@faker-js/faker';

export function makeDelivery(override?: Partial<Delivery>): Delivery {
  return new Delivery({
    addresseeId: faker.string.uuid(),
    stage: 'WAITING',
    ...override,
  });
}
