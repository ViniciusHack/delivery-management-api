import { Notification } from '@/domain/notifications/entities/notification';
import { NotificationsRepository } from '@/domain/notifications/repositories/notifications-repository';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(id: string) {
    return this.items.find((notification) => notification.id === id) ?? null;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async update(notification: Notification) {
    const index = this.items.findIndex((c) => c.id === notification.id);
    this.items[index] = notification;
  }
}
