import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { HashComparer } from '../cryptography/hashComparer';
import { HashGenerator } from '../cryptography/hashGenerator';
import { AdminsRepository } from '../repositories/admins-repository';
import { ShippersRepository } from '../repositories/shippers-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials';

interface ChangeShipperPasswordUseCaseProps {
  adminId: string;
  shipperId: string;
  newPassword: string;
  oldPassword: string;
}

export class ChangeShipperPasswordUseCase {
  constructor(
    private shippersRepository: ShippersRepository,
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    shipperId,
    newPassword,
    oldPassword,
  }: ChangeShipperPasswordUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const shipper = await this.shippersRepository.findById(shipperId);
    if (!shipper) {
      throw new ResourceNotFoundError('Shipper');
    }

    const doesOldPasswordMatch = await this.hashComparer.compare(
      oldPassword,
      shipper.password,
    );

    if (!doesOldPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await this.hashGenerator.hash(newPassword);

    shipper.password = newPasswordHash;

    await this.shippersRepository.update(shipper);
  }
}
