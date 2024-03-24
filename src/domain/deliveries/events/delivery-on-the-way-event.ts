import { DomainEvent } from '@/core/events/domain-event';
import { Delivery } from '../entities/delivery';

export class DeliveryOnTheWayEvent implements DomainEvent {
  public ocurredAt: Date;
  public addresseeId: string;
  public deliveryId: string;

  constructor(delivery: Delivery) {
    this.ocurredAt = new Date();
    this.addresseeId = delivery.addresseeId;
    this.deliveryId = delivery.id;
  }
}
