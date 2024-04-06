import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification';
import { Notifier } from '../notification/notifier';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { RecipientsRepository } from '../repositories/recipients-repository';

interface CreateAndSendNotificationUseCaseProps {
  title: string;
  message: string;
  recipientId: string;
}

@Injectable()
export class CreateAndSendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private recipientsRepository: RecipientsRepository,
    private notifier: Notifier,
  ) {}

  async execute({
    title,
    message,
    recipientId,
  }: CreateAndSendNotificationUseCaseProps): Promise<void> {
    const recipientExists = await this.recipientsRepository.findById(
      recipientId,
    );

    if (!recipientExists) {
      throw new ResourceNotFoundError('Recipient');
    }

    const notification = new Notification({
      title,
      message,
      recipientId,
    });

    await this.notificationsRepository.create(notification);

    await this.notifier.sendMail({
      content: notification.message,
      email: recipientExists.email,
      subject: notification.title,
    });
  }
}
