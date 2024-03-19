import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeOrder } from 'test/factories/makeOrder';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { DeleteOrderUseCase } from './delete-order';

let sut: DeleteOrderUseCase;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('Delete order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new DeleteOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should delete a order', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const order = makeOrder();
    inMemoryOrdersRepository.create(order);

    await sut.execute({
      adminId: admin.id,
      orderId: order.id,
    });

    const persistedOrder = await inMemoryOrdersRepository.findById(order.id);
    expect(persistedOrder).toBeNull();
  });

  it('should not be able to delete a order with an invalid admin', async () => {
    const order = makeOrder();
    inMemoryOrdersRepository.create(order);

    await expect(
      sut.execute({ orderId: order.id, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to delete a order that does not exist', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({ orderId: 'invalid-order-id', adminId: admin.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
