import { PaginationParams } from '@/core/utils';
import { Shipper } from 'src/domain/administration/entities/shipper';
import { Cpf } from 'src/domain/administration/entities/value-objects/cpf';
import { ShippersRepository } from 'src/domain/administration/repositories/shippers-repository';

export class InMemoryShippersRepository implements ShippersRepository {
  public items: Shipper[] = [];

  async findByCpf(cpf: Cpf) {
    return this.items.find((shipper) => shipper.cpf.isEqual(cpf)) ?? null;
  }

  async findById(id: string) {
    return this.items.find((shipper) => shipper.id === id) ?? null;
  }

  async findMany({ page, perPage }: PaginationParams): Promise<Shipper[]> {
    return this.items.slice((page - 1) * perPage, page * perPage);
  }

  async create(shipper: Shipper) {
    this.items.push(shipper);
  }

  async update(shipper: Shipper) {
    const index = this.items.findIndex((c) => c.id === shipper.id);
    this.items[index] = shipper;
  }

  async delete(id: string) {
    this.items = this.items.filter((shipper) => shipper.id !== id) ?? null;
  }
}
