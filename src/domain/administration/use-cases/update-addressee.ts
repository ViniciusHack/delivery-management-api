import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Geocoder } from '../addresses/geocoder';
import { Address } from '../entities/value-objects/address';
import { AddresseesRepository } from '../repositories/addressees-repository';
import { AdminsRepository } from '../repositories/admins-repository';

interface UpdateAddresseeUseCaseProps {
  adminId: string;
  addresseeId: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class UpdateAddresseeUseCase {
  constructor(
    private addresseesRepository: AddresseesRepository,
    private adminsRepository: AdminsRepository,
    private geocoder: Geocoder,
  ) {}

  async execute({
    adminId,
    addresseeId,
    street,
    number,
    neighborhood,
    city,
    state,
    country,
    zipCode,
  }: UpdateAddresseeUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const addressee = await this.addresseesRepository.findById(addresseeId);

    if (!addressee) {
      throw new ResourceNotFoundError('Addressee');
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

    const newAddress = new Address({
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

    addressee.address = newAddress;

    await this.addresseesRepository.update(addressee);
  }
}
