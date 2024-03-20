import { Delivery } from '../entities/delivery';

export abstract class DeliveriesRepository {
  abstract findById(id: string): Promise<Delivery | null>;
  abstract update(delivery: Delivery): Promise<void>;
}
