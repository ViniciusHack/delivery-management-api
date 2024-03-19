import { PaginationParams } from '@/domain/core/utils';
import { Conveyer } from '../entities/conveyer';
import { Cpf } from '../entities/value-objects/cpf';

export abstract class ConveyersRepository {
  abstract findByCpf(cpf: Cpf): Promise<Conveyer | null>;
  abstract findById(id: string): Promise<Conveyer | null>;
  abstract findMany(params: PaginationParams): Promise<Conveyer[]>;
  abstract create(conveyer: Conveyer): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
