import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Addressee } from '../entities/addressee';
import { Address } from '../entities/value-objects/address';
import { AddresseesRepository } from '../repositories/addressees-repository';
import { AdminsRepository } from '../repositories/admins-repository';

interface RegisterAddresseeUseCaseProps {
  adminId: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class RegisterAddresseeUseCase {
  constructor(
    private addresseesRepository: AddresseesRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    street,
    number,
    neighborhood,
    city,
    state,
    country,
    zipCode,
  }: RegisterAddresseeUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const address = new Address({
      street,
      number,
      neighborhood,
      city,
      state,
      country,
      zipCode,
    });

    const addressee = new Addressee({ address });

    await this.addresseesRepository.create(addressee);
  }
}
