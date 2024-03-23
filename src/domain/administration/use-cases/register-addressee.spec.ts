import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FakeGeocoder } from 'test/addresses/fake-geocoder';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
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
      }),
    ).rejects.toThrow(NotAllowedError);
  });
});
