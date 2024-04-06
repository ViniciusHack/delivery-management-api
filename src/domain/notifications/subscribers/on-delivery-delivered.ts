import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { DeliveryDeliveredEvent } from '@/domain/deliveries/events/delivery-delivered-event';
import { Injectable } from '@nestjs/common';
import { CreateAndSendNotificationUseCase } from '../use-cases/create-and-send-notification';

@Injectable()
export class OnDeliveryDelivered implements EventHandler {
  constructor(
    private createAndSendNotificationUseCase: CreateAndSendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNotification.bind(this),
      DeliveryDeliveredEvent.name,
    );
  }

  async sendNotification(event: DeliveryDeliveredEvent) {
    const { addresseeId } = event;

    await this.createAndSendNotificationUseCase.execute({
      message: 'Sua encomenda foi entregue!',
      recipientId: addresseeId,
      title: 'Sua entrega chegou!',
    });
  }
}
