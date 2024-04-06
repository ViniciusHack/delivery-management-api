import { Notification } from '@/domain/notifications/entities/notification';
import { NotificationsRepository } from '@/domain/notifications/repositories/notifications-repository';
import { Injectable } from '@nestjs/common';
import { NotificationMapper } from '../mappers/prisma-notification-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    return notification ? NotificationMapper.toDomain(notification) : null;
  }

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: NotificationMapper.toPersistence(notification),
    });
  }

  async update(notification: Notification): Promise<void> {
    await this.prisma.notification.update({
      data: NotificationMapper.toPersistence(notification),
      where: {
        id: notification.id,
      },
    });
  }
}
