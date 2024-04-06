import { Delivery, Stage } from '../entities/delivery';

export interface DeliveriesWithAddressee {
  id: string;
  stage: Stage;
  addressee: {
    address: string;
  };
  updatedAt?: Date;
}

export abstract class DeliveriesRepository {
  abstract findById(id: string): Promise<Delivery | null>;
  abstract findManyNearby(params: {
    latitude: number;
    longitude: number;
  }): Promise<DeliveriesWithAddressee[]>;
  abstract update(delivery: Delivery): Promise<void>;
}
