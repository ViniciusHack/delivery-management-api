import { Shipper } from '@/domain/deliveries/entities/shipper';
import { ShippersRepository } from '@/domain/deliveries/repositories/shippers-repository';

export class InMemoryShippersRepository implements ShippersRepository {
  public items: Shipper[] = [];

  async findById(id: string) {
    return this.items.find((shipper) => shipper.id === id) ?? null;
  }

  async update(shipper: Shipper) {
    const index = this.items.findIndex((c) => c.id === shipper.id);
    this.items[index] = shipper;
  }
}
