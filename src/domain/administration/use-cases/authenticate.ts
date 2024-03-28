import { Role } from '@/core/permissions';
import { Injectable } from '@nestjs/common';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hashComparer';
import { Shipper } from '../entities/shipper';
import { Cpf } from '../entities/value-objects/cpf';
import { AdminsRepository } from '../repositories/admins-repository';
import { ShippersRepository } from '../repositories/shippers-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials';

interface AuthenticateUseCaseProps {
  cpf: string;
  password: string;
}

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private shippersRepository: ShippersRepository,
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
    };
    let shipper: Shipper | null = null;

    const admin = await this.adminsRepository.findByCpf(cpf);
    if (!admin) {
      shipper = await this.shippersRepository.findByCpf(cpf);
      if (!shipper) {
        throw new InvalidCredentialsError();
      }
    }

    const passwordMatches = await this.hashComparer.compare(
      password,
      admin ? admin.password : shipper?.password ?? '',
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    payload = {
      sub: admin?.id ?? shipper?.id ?? '',
      role: admin ? Role.Admin : Role.Shipper,
    };

    const token = await this.encrypter.encrypt(payload);

    return { token };
  }
}
