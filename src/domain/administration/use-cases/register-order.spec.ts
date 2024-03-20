import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAddressee } from 'test/factories/makeAddressee';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { RegisterOrderUseCase } from './register-order';

let sut: RegisterOrderUseCase;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;

describe('Register order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    sut = new RegisterOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryAdminsRepository,
      inMemoryAddresseesRepository,
    );
  });

  it('should register a new order', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    const addressee = makeAddressee();
    await inMemoryAddresseesRepository.create(addressee);

    await sut.execute({ addresseeId: addressee.id, adminId: admin.id });

    const persistedOrder = inMemoryOrdersRepository.items[0];

    expect(persistedOrder).toEqual(
      expect.objectContaining({
        addresseeId: addressee.id,
        stage: 'IN_ANALYSIS',
      }),
    );
  });

  it('should not be able to register an order with an invalid admin', async () => {
    const addressee = makeAddressee();
    await inMemoryAddresseesRepository.create(addressee);

    await expect(
      sut.execute({ addresseeId: addressee.id, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to register an order for an inexistent addressee', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({
        addresseeId: 'non-existent-addressee-id',
        adminId: admin.id,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
