import { ConflictError } from '@/core/errors/conflict-error';
import { HashGenerator } from '../cryptography/hashGenerator';
import { Admin } from '../entities/admin';
import { Cpf } from '../entities/value-objects/cpf';
import { AdminsRepository } from '../repositories/admins-repository';

interface RegisterAdminUseCaseProps {
  cpf: string;
  password: string;
}

export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf: cpfString,
    password,
  }: RegisterAdminUseCaseProps): Promise<void> {
    const cpf = new Cpf(cpfString);

    const adminAlreadyExists = await this.adminsRepository.findByCpf(cpf);
    if (adminAlreadyExists) {
      throw new ConflictError('Admin');
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const admin = new Admin({ cpf, password: passwordHash });

    await this.adminsRepository.create(admin);
  }
}
