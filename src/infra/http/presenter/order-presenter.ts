import { Order } from '@/domain/administration/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      stage: order.stage,
      createdAt: order.createdAt,
      deliveryDate: order.deliveryDate,
    };
  }
}
