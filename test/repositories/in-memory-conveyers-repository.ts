import { PaginationParams } from '@/domain/core/utils';
import { Conveyer } from 'src/domain/administration/entities/conveyer';
import { Cpf } from 'src/domain/administration/entities/value-objects/cpf';
import { ConveyersRepository } from 'src/domain/administration/repositories/conveyers-repository';

export class InMemoryConveyersRepository implements ConveyersRepository {
  public items: Conveyer[] = [];

  async findByCpf(cpf: Cpf) {
    return this.items.find((conveyer) => conveyer.cpf.isEqual(cpf)) ?? null;
  }

  async create(conveyer: Conveyer) {
    this.items.push(conveyer);
  }

  async findMany({ page, perPage }: PaginationParams): Promise<Conveyer[]> {
    return this.items.slice((page - 1) * perPage, page * perPage);
  }
}
