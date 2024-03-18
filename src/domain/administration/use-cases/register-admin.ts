import { ConflictError } from 'src/domain/core/errors/conflict-error';
import { Admin } from '../entities/admin';
import { Cpf } from '../entities/value-objects/cpf';
import { AdminsRepository } from '../repositories/admins-repository';

interface RegisterAdminUseCaseProps {
  cpf: string;
  password: string;
}

export class RegisterAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    cpf: cpfString,
    password,
  }: RegisterAdminUseCaseProps): Promise<void> {
    const cpf = new Cpf(cpfString);

    const adminAlreadyExists = await this.adminsRepository.findByCpf(cpf);
    if (adminAlreadyExists) {
      throw new ConflictError('Admin');
    }

    const admin = new Admin({ cpf, password });

    await this.adminsRepository.create(admin);
  }
}
