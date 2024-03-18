import { permissions } from '@/domain/core/permissions';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hashComparer';
import { Conveyer } from '../entities/conveyer';
import { Cpf } from '../entities/value-objects/cpf';
import { AdminsRepository } from '../repositories/admins-repository';
import { ConveyersRepository } from '../repositories/conveyers-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials';

interface AuthenticateUseCaseProps {
  cpf: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private conveyersRepository: ConveyersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf: cpfString,
    password,
  }: AuthenticateUseCaseProps): Promise<{ token: string }> {
    const cpf = new Cpf(cpfString);
    let payload = {
      sub: '',
      role: '',
      permissions: [''],
    };
    let conveyer: Conveyer | null = null;

    const admin = await this.adminsRepository.findByCpf(cpf);
    if (!admin) {
      conveyer = await this.conveyersRepository.findByCpf(cpf);
      if (!conveyer) {
        throw new InvalidCredentialsError();
      }
    }

    const passwordMatches = await this.hashComparer.compare(
      password,
      admin ? admin.password : conveyer?.password ?? '',
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    payload = {
      sub: admin?.id ?? conveyer?.id ?? '',
      role: admin ? 'admin' : 'conveyer',
      permissions: admin ? permissions.admin : permissions.conveyer,
    };

    const token = await this.encrypter.encrypt(payload);

    return { token };
  }
}
