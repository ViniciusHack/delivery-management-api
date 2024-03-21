import { Delivery } from '@/domain/deliveries/entities/delivery';
import { DeliveriesRepository } from '@/domain/deliveries/repositories/deliveries-repository';

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = [];

  async findById(id: string) {
    return this.items.find((delivery) => delivery.id === id) ?? null;
  }

  async update(delivery: Delivery) {
    const index = this.items.findIndex((o) => o.id === delivery.id);
    this.items[index] = delivery;
  }
}
