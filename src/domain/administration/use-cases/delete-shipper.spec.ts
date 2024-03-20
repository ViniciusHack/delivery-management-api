import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeShipper } from 'test/factories/makeShipper';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-shippers-repository';
import { DeleteShipperUseCase } from './delete-shipper';

let sut: DeleteShipperUseCase;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('Delete shipper', () => {
  beforeEach(() => {
    inMemoryShippersRepository = new InMemoryShippersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new DeleteShipperUseCase(
      inMemoryShippersRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should delete a shipper', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const shipper = makeShipper();
    inMemoryShippersRepository.create(shipper);

    await sut.execute({
      adminId: admin.id,
      shipperId: shipper.id,
    });

    const persistedShipper = await inMemoryShippersRepository.findById(
      shipper.id,
    );
    expect(persistedShipper).toBeNull();
  });

  it('should not be able to delete a shipper with an invalid admin', async () => {
    const shipper = makeShipper();
    inMemoryShippersRepository.create(shipper);

    await expect(
      sut.execute({ shipperId: shipper.id, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to delete a shipper that does not exist', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({ shipperId: 'invalid-shipper-id', adminId: admin.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
