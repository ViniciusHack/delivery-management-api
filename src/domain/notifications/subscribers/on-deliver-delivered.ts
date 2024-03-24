import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { DeliveryDeliveredEvent } from '@/domain/deliveries/events/delivery-delivered-event';
import { CreateAndSendNotificationUseCase } from '../use-cases/create-and-send-notification';

export class OnDeliverDelivered implements EventHandler {
  constructor(
    private createAndSendNotificationUseCase: CreateAndSendNotificationUseCase,
  ) {}

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
