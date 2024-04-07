import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { DeliveryReturnedEvent } from '@/domain/deliveries/events/delivery-returned-event';
import { Injectable } from '@nestjs/common';
import { CreateAndSendNotificationUseCase } from '../use-cases/create-and-send-notification';

@Injectable()
export class OnDeliveryReturned implements EventHandler {
  constructor(
    private createAndSendNotificationUseCase: CreateAndSendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNotification.bind(this),
      DeliveryReturnedEvent.name,
    );
  }

  async sendNotification(event: DeliveryReturnedEvent) {
    const { addresseeId } = event;

    await this.createAndSendNotificationUseCase.execute({
      message: 'Devido as circunstâncias, sua entrega retornou.',
      recipientId: addresseeId,
      title: 'Sua entrega retornou.',
    });
  }
}
