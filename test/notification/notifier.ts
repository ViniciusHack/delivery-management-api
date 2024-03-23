import { Notifier } from '@/domain/notifications/notification/notifier';

export class FakeNotifier implements Notifier {
  public notificationsSent: Notification[] = [];

  async sendNotification(notification) {
    this.notificationsSent.push(notification);
    return Promise.resolve();
  }
}
