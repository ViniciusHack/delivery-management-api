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
    const addresseesNearby = this.inMemoryAddresseesRepository.items.filter(
      (addressee) => {
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
      },
    );

    const deliveriesNearby = this.items.filter((delivery) =>
      addresseesNearby.some(
        (addressee) => addressee.id === delivery.addresseeId,
      ),
    );

    return deliveriesNearby.map((delivery) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const addressee = addresseesNearby.find(
        (addressee) => addressee.id === delivery.addresseeId,
      )!;
      return {
        id: delivery.id,
        stage: delivery.stage,
        updatedAt: delivery.updatedAt ?? undefined,
        addressee: {
          address: addressee.address.toString(),
        },
      };
    });
  }

  async update(delivery: Delivery) {
    const index = this.items.findIndex((o) => o.id === delivery.id);
    this.items[index] = delivery;
  }
}
