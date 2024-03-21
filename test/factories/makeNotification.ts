import { Notification } from '@/domain/notifications/entities/notification';
import { faker } from '@faker-js/faker';

export function makeNotification(
  override?: Partial<Notification>,
): Notification {
  return new Notification({
    title: faker.lorem.words(),
    message: faker.lorem.text(),
    recipientId: faker.string.uuid(),
    ...override,
  });
}
