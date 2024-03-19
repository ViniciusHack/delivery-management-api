import { Order } from '@/domain/administration/entities/order';
import { faker } from '@faker-js/faker';

export function makeOrder(override?: Partial<Order>): Order {
  return new Order({
    addresseeId: faker.string.uuid(),
    ...override,
  });
}
