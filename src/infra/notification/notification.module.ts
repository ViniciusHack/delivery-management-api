import { Notifier } from '@/domain/notifications/notification/notifier';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { ResendNotifier } from './notifier';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Notifier,
      useClass: ResendNotifier,
    },
  ],
  exports: [Notifier],
})
export class NotificationModule {}
