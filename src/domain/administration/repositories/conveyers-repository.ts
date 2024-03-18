import { PaginationParams } from '@/domain/core/utils';
import { Conveyer } from '../entities/conveyer';
import { Cpf } from '../entities/value-objects/cpf';

export abstract class ConveyersRepository {
  abstract findByCpf(cpf: Cpf): Promise<Conveyer | null>;
  abstract create(conveyer: Conveyer): Promise<void>;
  abstract findMany(params: PaginationParams): Promise<Conveyer[]>;
}
