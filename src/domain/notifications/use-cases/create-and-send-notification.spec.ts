import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeRecipient } from 'test/factories/makeRecipient';
import { FakeNotifier } from 'test/notification/fake-notifier';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { CreateAndSendNotificationUseCase } from './create-and-send-notification';

let sut: CreateAndSendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let fakeNotifier: FakeNotifier;

describe('Send notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    fakeNotifier = new FakeNotifier();
    sut = new CreateAndSendNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryRecipientsRepository,
      fakeNotifier,
    );
  });

  it('should create and send a notification', async () => {
    const recipient = makeRecipient();

    inMemoryRecipientsRepository.items.push(recipient);

    await sut.execute({
      title: 'my title',
      message: 'My message',
      recipientId: recipient.id,
    });

    const persistedNotification = inMemoryNotificationsRepository.items[0];

    expect(persistedNotification).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'my title',
        message: 'My message',
        recipientId: recipient.id,
        createdAt: expect.any(Date),
      }),
    );

    expect(fakeNotifier.notificationsSent).toEqual([
      expect.objectContaining({
        subject: 'my title',
      }),
    ]);
  });

  it('should not create and send a notification if recipient does not exist', async () => {
    await expect(
      sut.execute({
        title: 'my title',
        message: 'My message',
        recipientId: 'invalid-id',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
