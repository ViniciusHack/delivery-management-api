import { ConflictError } from '@/core/errors/conflict-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { HashGenerator } from '../cryptography/hashGenerator';
import { Shipper } from '../entities/shipper';
import { Cpf } from '../entities/value-objects/cpf';
import { AdminsRepository } from '../repositories/admins-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface RegisterShipperUseCaseProps {
  cpf: string;
  password: string;
  adminId: string;
}

export class RegisterShipperUseCase {
  constructor(
    private shippersRepository: ShippersRepository,
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf: cpfString,
    password,
    adminId,
  }: RegisterShipperUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const cpf = new Cpf(cpfString);

    const shipperAlreadyExists = await this.shippersRepository.findByCpf(cpf);
    if (shipperAlreadyExists) {
      throw new ConflictError('Shipper');
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const shipper = new Shipper({ cpf, password: passwordHash });

    await this.shippersRepository.create(shipper);
  }
}
