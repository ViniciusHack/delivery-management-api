import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAddressee } from 'test/factories/makeAddressee';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { DeleteAddresseeUseCase } from './delete-addressee';

let sut: DeleteAddresseeUseCase;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('Delete addressee', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new DeleteAddresseeUseCase(
      inMemoryAddresseesRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should delete a addressee', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const addressee = makeAddressee();
    inMemoryAddresseesRepository.create(addressee);

    await sut.execute({
      adminId: admin.id,
      addresseeId: addressee.id,
    });

    const persistedAddressee = await inMemoryAddresseesRepository.findById(
      addressee.id,
    );
    expect(persistedAddressee).toBeNull();
  });

  it('should not be able to delete a addressee with an invalid admin', async () => {
    const addressee = makeAddressee();
    inMemoryAddresseesRepository.create(addressee);

    await expect(
      sut.execute({ addresseeId: addressee.id, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to delete a addressee that does not exist', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({ addresseeId: 'invalid-addressee-id', adminId: admin.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
