import { Notification } from '../entities/notification';

export abstract class Notifier {
  abstract sendNotification(notification: Notification): Promise<void>;
}
