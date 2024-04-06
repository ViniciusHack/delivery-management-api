import { Notification } from '@/domain/notifications/entities/notification';
import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export class NotificationMapper {
  static toDomain(notification: PrismaNotification): Notification {
    return new Notification({
      message: notification.message,
      recipientId: notification.recipientId,
      title: notification.title,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt ?? undefined,
    });
  }

  static toPersistence(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      message: notification.message,
      recipientId: notification.recipientId,
      title: notification.title,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt ?? undefined,
    };
  }
}
