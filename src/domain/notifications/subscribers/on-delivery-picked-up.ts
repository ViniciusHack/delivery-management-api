import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { DeliveryPickedUpEvent } from '@/domain/deliveries/events/delivery-on-the-way-event';
import { Injectable } from '@nestjs/common';
import { CreateAndSendNotificationUseCase } from '../use-cases/create-and-send-notification';

@Injectable()
export class OnDeliveryPickedUp implements EventHandler {
  constructor(
    private createAndSendNotificationUseCase: CreateAndSendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNotification.bind(this),
      DeliveryPickedUpEvent.name,
    );
  }

  async sendNotification(event: DeliveryPickedUpEvent) {
    const { addresseeId } = event;

    await this.createAndSendNotificationUseCase.execute({
      message:
        'Sua encomenda foi pega por um entregador e agora está à caminho!',
      recipientId: addresseeId,
      title: 'Sua entrega está à caminho!',
    });
  }
}
