import { Delivery } from '@/domain/deliveries/entities/delivery';

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    return {
      id: delivery.id,
      stage: delivery.stage,
    };
  }
}
