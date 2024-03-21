import { Notification } from '../entities/notification';

export abstract class NotificationsRepository {
  abstract findById(id: string): Promise<Notification | null>;
  abstract create(notification: Notification): Promise<void>;
  abstract update(notification: Notification): Promise<void>;
}
