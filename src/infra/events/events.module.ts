import { OnDeliveryDelivered } from '@/domain/notifications/subscribers/on-delivery-delivered';
import { OnDeliveryPickedUp } from '@/domain/notifications/subscribers/on-delivery-picked-up';
import { OnDeliveryReturned } from '@/domain/notifications/subscribers/on-delivery-returned';
import { CreateAndSendNotificationUseCase } from '@/domain/notifications/use-cases/create-and-send-notification';
import { Module } from '@nestjs/common';

@Module({
  imports: [CreateAndSendNotificationUseCase],
  providers: [OnDeliveryDelivered, OnDeliveryReturned, OnDeliveryPickedUp],
})
export class EventsModule {}
