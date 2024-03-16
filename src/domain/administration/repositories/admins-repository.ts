import { Admin } from '../entities/admin';
import { Cpf } from '../entities/value-objects/cpf';

export abstract class AdminsRepository {
  abstract findByCpf(cpf: Cpf): Promise<Admin | null>;
  abstract create(admin: Admin): Promise<void>;
}
