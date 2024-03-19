import { PaginationParams } from '@/domain/core/utils';
import { Conveyer } from 'src/domain/administration/entities/conveyer';
import { Cpf } from 'src/domain/administration/entities/value-objects/cpf';
import { ConveyersRepository } from 'src/domain/administration/repositories/conveyers-repository';

export class InMemoryConveyersRepository implements ConveyersRepository {
  public items: Conveyer[] = [];

  async findByCpf(cpf: Cpf) {
    return this.items.find((conveyer) => conveyer.cpf.isEqual(cpf)) ?? null;
  }

  async findById(id: string) {
    return this.items.find((conveyer) => conveyer.id === id) ?? null;
  }

  async findMany({ page, perPage }: PaginationParams): Promise<Conveyer[]> {
    return this.items.slice((page - 1) * perPage, page * perPage);
  }

  async create(conveyer: Conveyer) {
    this.items.push(conveyer);
  }

  async update(conveyer: Conveyer) {
    const index = this.items.findIndex((c) => c.id === conveyer.id);
    this.items[index] = conveyer;
  }

  async delete(id: string) {
    this.items = this.items.filter((conveyer) => conveyer.id !== id) ?? null;
  }
}
