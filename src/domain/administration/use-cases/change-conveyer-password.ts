import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { HashComparer } from '../cryptography/hashComparer';
import { HashGenerator } from '../cryptography/hashGenerator';
import { AdminsRepository } from '../repositories/admins-repository';
import { ConveyersRepository } from '../repositories/conveyers-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials';

interface ChangeConveyerPasswordUseCaseProps {
  adminId: string;
  conveyerId: string;
  newPassword: string;
  oldPassword: string;
}

export class ChangeConveyerPasswordUseCase {
  constructor(
    private conveyersRepository: ConveyersRepository,
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    conveyerId,
    newPassword,
    oldPassword,
  }: ChangeConveyerPasswordUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const conveyer = await this.conveyersRepository.findById(conveyerId);
    if (!conveyer) {
      throw new ResourceNotFoundError('Conveyer');
    }

    const doesOldPasswordMatch = await this.hashComparer.compare(
      oldPassword,
      conveyer.password,
    );

    if (!doesOldPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await this.hashGenerator.hash(newPassword);

    conveyer.password = newPasswordHash;

    await this.conveyersRepository.update(conveyer);
  }
}
