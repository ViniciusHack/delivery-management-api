import { Notifier } from '@/domain/notifications/notification/notifier';

export class FakeNotifier implements Notifier {
  public notificationsSent: Notification[] = [];

  async sendMail(data) {
    this.notificationsSent.push(data);
    return Promise.resolve();
  }
}
