import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { FakeGeocoder } from 'test/addresses/fake-geocoder';
import { makeAddressee } from 'test/factories/makeAddressee';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { UpdateAddresseeUseCase } from './update-addressee';

let sut: UpdateAddresseeUseCase;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeGeocoder: FakeGeocoder;

describe('Update addressee', () => {
  beforeEach(() => {
    fakeGeocoder = new FakeGeocoder();
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new UpdateAddresseeUseCase(
      inMemoryAddresseesRepository,
      inMemoryAdminsRepository,
      fakeGeocoder,
    );
  });

  it('should update a new addressee', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    const addressee = makeAddressee();
    await inMemoryAddresseesRepository.create(addressee);

    await sut.execute({
      adminId: admin.id,
      addresseeId: addressee.id,
      city: 'New City',
      country: 'New Country',
      neighborhood: 'New Neighborhood',
      number: 'New Number',
      state: 'New State',
      street: 'New Street',
      zipCode: 'New ZipCode',
    });

    const persistedAddressee = inMemoryAddresseesRepository.items[0];

    expect(persistedAddressee).toEqual(
      expect.objectContaining({
        id: addressee.id,
        address: {
          city: 'New City',
          country: 'New Country',
          neighborhood: 'New Neighborhood',
          number: 'New Number',
          state: 'New State',
          street: 'New Street',
          zipCode: 'New ZipCode',
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        },
      }),
    );
  });

  it('should not be able to update an addressee with an invalid admin', async () => {
    const addressee = makeAddressee();
    await inMemoryAddresseesRepository.create(addressee);

    await expect(
      sut.execute({
        adminId: 'invalid-admin-id',
        addresseeId: addressee.id,
        city: 'New City',
        country: 'New Country',
        neighborhood: 'New Neighborhood',
        number: 'New Number',
        state: 'New State',
        street: 'New Street',
        zipCode: 'New ZipCode',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to update an inexistent addressee', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({
        adminId: admin.id,
        addresseeId: 'invalid-addressee-id',
        city: 'New City',
        country: 'New Country',
        neighborhood: 'New Neighborhood',
        number: 'New Number',
        state: 'New State',
        street: 'New Street',
        zipCode: 'New ZipCode',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
