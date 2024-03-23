import { Delivery } from '../entities/delivery';

export abstract class DeliveriesRepository {
  abstract findById(id: string): Promise<Delivery | null>;
  abstract findManyNearby(params: {
    latitude: number;
    longitude: number;
  }): Promise<Delivery[]>;
  abstract update(delivery: Delivery): Promise<void>;
}
