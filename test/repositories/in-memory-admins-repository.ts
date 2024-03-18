import { Admin } from 'src/domain/administration/entities/admin';
import { Cpf } from 'src/domain/administration/entities/value-objects/cpf';
import { AdminsRepository } from 'src/domain/administration/repositories/admins-repository';

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = [];

  async findByCpf(cpf: Cpf) {
    return this.items.find((admin) => admin.cpf.isEqual(cpf)) ?? null;
  }

  async findById(id: string) {
    return this.items.find((admin) => admin.id === id) ?? null;
  }

  async create(admin: Admin) {
    this.items.push(admin);
  }
}
