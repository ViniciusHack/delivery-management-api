import { OnDeliveryDelivered } from '@/domain/notifications/subscribers/on-delivery-delivered';
import { OnDeliveryPickedUp } from '@/domain/notifications/subscribers/on-delivery-picked-up';
import { OnDeliveryReturned } from '@/domain/notifications/subscribers/on-delivery-returned';
import { CreateAndSendNotificationUseCase } from '@/domain/notifications/use-cases/create-and-send-notification';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [
    OnDeliveryDelivered,
    OnDeliveryReturned,
    OnDeliveryPickedUp,
    CreateAndSendNotificationUseCase,
  ],
})
export class EventsModule {}
