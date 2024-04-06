import { Notifier } from '@/domain/notifications/notification/notifier';
import { Module } from '@nestjs/common';
import { FakeNotifier } from './notifier';

@Module({
  providers: [
    {
      provide: Notifier,
      useClass: FakeNotifier,
    },
  ],
  exports: [Notifier],
})
export class NotificationModule {}
