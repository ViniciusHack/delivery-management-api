import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists';
import { Geocoder } from '../addresses/geocoder';
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
  email: string;
}

export class RegisterAddresseeUseCase {
  constructor(
    private addresseesRepository: AddresseesRepository,
    private adminsRepository: AdminsRepository,
    private geocoder: Geocoder,
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
    email,
  }: RegisterAddresseeUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const addresseeAlreadyExists = await this.addresseesRepository.findByEmail(
      email,
    );

    if (addresseeAlreadyExists) {
      throw new ResourceAlreadyExistsError();
    }

    const { latitude, longitude } = await this.geocoder.getCoordinates({
      street,
      number,
      neighborhood,
      city,
      state,
      country,
      zipCode,
    });

    const address = new Address({
      street,
      number,
      neighborhood,
      city,
      state,
      country,
      zipCode,
      latitude,
      longitude,
    });

    const addressee = new Addressee({ address, email });

    await this.addresseesRepository.create(addressee);
  }
}
