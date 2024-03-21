import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeNotification } from 'test/factories/makeNotification';
import { makeRecipient } from 'test/factories/makeRecipient';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { NotificationAlreadyRead } from '../entities/errors/notification-already-read';
import { ReadNotificationUseCase } from './read-notification';

let sut: ReadNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;

describe('Register delivery', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should read a notification', async () => {
    const recipient = makeRecipient();

    inMemoryRecipientsRepository.items.push(recipient);

    const notification = makeNotification({
      recipientId: recipient.id,
    });

    inMemoryNotificationsRepository.items.push(notification);

    const beforeReadDate = new Date();

    await sut.execute({
      notificationId: notification.id,
      recipientId: notification.recipientId,
    });

    const persistedDelivery = inMemoryNotificationsRepository.items[0];

    expect(persistedDelivery).toEqual(
      expect.objectContaining({
        id: notification.id,
        recipientId: recipient.id,
        readAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

    expect(persistedDelivery.updatedAt?.getTime()).toBeGreaterThanOrEqual(
      beforeReadDate.getTime(),
    );
  });

  it('should not read a notification if recipient does not exist', async () => {
    const notification = makeNotification();

    inMemoryNotificationsRepository.items.push(notification);

    await expect(
      sut.execute({
        notificationId: notification.id,
        recipientId: 'invalid-id',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not read a notification if notification does not exist', async () => {
    const recipient = makeRecipient();

    inMemoryRecipientsRepository.items.push(recipient);

    await expect(
      sut.execute({
        notificationId: 'invalid-id',
        recipientId: recipient.id,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not read a notification if notification is already read', async () => {
    const recipient = makeRecipient();

    inMemoryRecipientsRepository.items.push(recipient);

    const notification = makeNotification({
      recipientId: recipient.id,
      readAt: new Date(),
    });

    inMemoryNotificationsRepository.items.push(notification);

    await expect(
      sut.execute({
        notificationId: notification.id,
        recipientId: recipient.id,
      }),
    ).rejects.toThrowError(NotificationAlreadyRead);
  });

  it('should not read a notification if notification is not assigned to the recipient', async () => {
    const recipient1 = makeRecipient();
    const recipient2 = makeRecipient();

    inMemoryRecipientsRepository.items.push(recipient1);
    inMemoryRecipientsRepository.items.push(recipient2);

    const notification = makeNotification({
      recipientId: recipient1.id,
    });

    inMemoryNotificationsRepository.items.push(notification);

    await expect(
      sut.execute({
        notificationId: notification.id,
        recipientId: recipient2.id,
      }),
    ).rejects.toThrowError(NotAllowedError);
  });
});
