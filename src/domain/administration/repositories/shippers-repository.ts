import { PaginationParams } from '@/core/utils';
import { Shipper } from '../entities/shipper';
import { Cpf } from '../entities/value-objects/cpf';

export abstract class ShippersRepository {
  abstract findByCpf(cpf: Cpf): Promise<Shipper | null>;
  abstract findById(id: string): Promise<Shipper | null>;
  abstract findMany(params: PaginationParams): Promise<Shipper[]>;
  abstract create(shipper: Shipper): Promise<void>;
  abstract update(shipper: Shipper): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
