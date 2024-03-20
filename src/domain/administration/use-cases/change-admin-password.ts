import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { HashComparer } from '../cryptography/hashComparer';
import { HashGenerator } from '../cryptography/hashGenerator';
import { AdminsRepository } from '../repositories/admins-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials';

interface ChangeAdminPasswordUseCaseProps {
  adminId: string;
  newPassword: string;
  oldPassword: string;
}

export class ChangeAdminPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    newPassword,
    oldPassword,
  }: ChangeAdminPasswordUseCaseProps): Promise<void> {
    const admin = await this.adminsRepository.findById(adminId);
    if (!admin) {
      throw new ResourceNotFoundError('Admin');
    }

    const doesOldPasswordMatch = await this.hashComparer.compare(
      oldPassword,
      admin.password,
    );

    if (!doesOldPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await this.hashGenerator.hash(newPassword);

    admin.password = newPasswordHash;

    await this.adminsRepository.update(admin);
  }
}
