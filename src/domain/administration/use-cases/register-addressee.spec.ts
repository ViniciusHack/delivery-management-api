import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists';
import { FakeGeocoder } from 'test/addresses/fake-geocoder';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { Addressee } from '../entities/addressee';
import { Address } from '../entities/value-objects/address';
import { RegisterAddresseeUseCase } from './register-addressee';

let sut: RegisterAddresseeUseCase;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeGeocoder: FakeGeocoder;

describe('Register addressee', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeGeocoder = new FakeGeocoder();
    sut = new RegisterAddresseeUseCase(
      inMemoryAddresseesRepository,
      inMemoryAdminsRepository,
      fakeGeocoder,
    );
  });

  it('should register a new addressee', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await sut.execute({
      city: 'City',
      country: 'Country',
      neighborhood: 'Neighborhood',
      number: 'Number',
      state: 'State',
      street: 'Street',
      zipCode: 'ZipCode',
      adminId: admin.id,
      email: 'johndoe@test.com',
    });

    const persistedAddressee = inMemoryAddresseesRepository.items[0];

    expect(persistedAddressee).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        address: {
          city: 'City',
          country: 'Country',
          neighborhood: 'Neighborhood',
          number: 'Number',
          state: 'State',
          street: 'Street',
          zipCode: 'ZipCode',
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        },
        email: 'johndoe@test.com',
      }),
    );
  });

  it('should not be able to register an addressee with an invalid admin', async () => {
    await expect(
      sut.execute({
        city: 'City',
        country: 'Country',
        neighborhood: 'Neighborhood',
        number: 'Number',
        state: 'State',
        street: 'Street',
        zipCode: 'ZipCode',
        adminId: 'invalid-admin-id',
        email: 'johndoe@test.com',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to register an addressee with an already used email', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    inMemoryAddresseesRepository.items.push(
      new Addressee({
        address: new Address({
          city: 'City',
          country: 'Country',
          neighborhood: 'Neighborhood',
          number: 'Number',
          state: 'State',
          street: 'Street',
          zipCode: 'ZipCode',
          latitude: 0,
          longitude: 0,
        }),
        email: 'johndoe@test.com',
      }),
    );

    expect(() =>
      sut.execute({
        city: 'City',
        country: 'Country',
        neighborhood: 'Neighborhood',
        number: 'Number',
        state: 'State',
        street: 'Street',
        zipCode: 'ZipCode',
        adminId: admin.id,
        email: 'johndoe@test.com',
      }),
    ).rejects.toThrow(ResourceAlreadyExistsError);
  });
});
