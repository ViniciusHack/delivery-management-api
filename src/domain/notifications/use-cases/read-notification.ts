import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { RecipientsRepository } from '../repositories/recipients-repository';

interface ReadNotificationUseCaseProps {
  notificationId: string;
  recipientId: string;
}

@Injectable()
export class ReadNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseProps): Promise<void> {
    const notification = await this.notificationsRepository.findById(
      notificationId,
    );

    if (!notification) {
      throw new ResourceNotFoundError('Notification');
    }

    const recipientExists = await this.recipientsRepository.findById(
      recipientId,
    );

    if (!recipientExists) {
      throw new ResourceNotFoundError('Recipient');
    }

    if (notification.recipientId !== recipientId) {
      throw new NotAllowedError();
    }

    notification.read();

    await this.notificationsRepository.update(notification);
  }
}
