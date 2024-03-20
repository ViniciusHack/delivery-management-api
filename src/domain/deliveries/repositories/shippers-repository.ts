import { Shipper } from '../entities/shipper';

export abstract class ShippersRepository {
  abstract findById(id: string): Promise<Shipper | null>;
}
