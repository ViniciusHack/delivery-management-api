import { getDistanceBetweenCoordinates } from '@/core/utils';
import { Delivery } from '@/domain/deliveries/entities/delivery';
import { DeliveriesRepository } from '@/domain/deliveries/repositories/deliveries-repository';
import { InMemoryAddresseesRepository } from './in-memory-deliveries-addressees-repository';

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = [];

  constructor(
    private readonly inMemoryAddresseesRepository: InMemoryAddresseesRepository,
  ) {}

  async findById(id: string) {
    return this.items.find((delivery) => delivery.id === id) ?? null;
  }

  async findManyNearby(params: { latitude: number; longitude: number }) {
    const addresseesNearby = this.inMemoryAddresseesRepository.items
      .filter((addressee) => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: addressee.address.latitude,
            longitude: addressee.address.longitude,
          },
        );

        return distance < 10;
      })
      .map((addressee) => addressee.id);

    return this.items.filter((delivery) =>
      addresseesNearby.includes(delivery.addresseeId),
    );
  }

  async update(delivery: Delivery) {
    const index = this.items.findIndex((o) => o.id === delivery.id);
    this.items[index] = delivery;
  }
}
