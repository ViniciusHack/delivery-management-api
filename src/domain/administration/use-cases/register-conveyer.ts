import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ConflictError } from 'src/domain/core/errors/conflict-error';
import { HashGenerator } from '../cryptography/hashGenerator';
import { Conveyer } from '../entities/conveyer';
import { Cpf } from '../entities/value-objects/cpf';
import { AdminsRepository } from '../repositories/admins-repository';
import { ConveyersRepository } from '../repositories/conveyers-repository';

interface RegisterConveyerUseCaseProps {
  cpf: string;
  password: string;
  adminId: string;
}

export class RegisterConveyerUseCase {
  constructor(
    private conveyersRepository: ConveyersRepository,
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf: cpfString,
    password,
    adminId,
  }: RegisterConveyerUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const cpf = new Cpf(cpfString);

    const conveyerAlreadyExists = await this.conveyersRepository.findByCpf(cpf);
    if (conveyerAlreadyExists) {
      throw new ConflictError('Conveyer');
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const conveyer = new Conveyer({ cpf, password: passwordHash });

    await this.conveyersRepository.create(conveyer);
  }
}
