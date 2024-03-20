import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AddresseesRepository } from '../repositories/addressees-repository';
import { AdminsRepository } from '../repositories/admins-repository';

interface DeleteAddresseeUseCaseProps {
  adminId: string;
  addresseeId: string;
}

export class DeleteAddresseeUseCase {
  constructor(
    private addresseesRepository: AddresseesRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    addresseeId,
  }: DeleteAddresseeUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const addresseeExists = await this.addresseesRepository.findById(
      addresseeId,
    );
    if (!addresseeExists) {
      throw new ResourceNotFoundError('Addressee');
    }

    await this.addresseesRepository.delete(addresseeId);
  }
}
