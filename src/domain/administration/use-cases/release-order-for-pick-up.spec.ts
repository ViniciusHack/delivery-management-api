import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeOrder } from 'test/factories/makeOrder';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderNotWaitingToBePickedUpError } from '../entities/errors/order-not-waiting-to-be-picked-up';
import { ReleaseOrderForPickUpUseCase } from './release-order-for-pick-up';

let sut: ReleaseOrderForPickUpUseCase;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('Delete order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new ReleaseOrderForPickUpUseCase(
      inMemoryOrdersRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should release an order for pick up', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const order = makeOrder();
    inMemoryOrdersRepository.create(order);

    await sut.execute({
      adminId: admin.id,
      orderId: order.id,
    });

    const persistedOrder = await inMemoryOrdersRepository.findById(order.id);
    expect(persistedOrder).toHaveProperty('stage', 'WAITING');
  });

  it('should not be able to release an order for pick up with an invalid admin', async () => {
    const order = makeOrder();
    inMemoryOrdersRepository.create(order);

    await expect(
      sut.execute({ orderId: order.id, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to delete an order that does not exist', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({ orderId: 'invalid-order-id', adminId: admin.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not be able to release an order for pick up when it is not waiting for pick up', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    const order = makeOrder({ stage: 'DELIVERED' });
    inMemoryOrdersRepository.create(order);

    await expect(
      sut.execute({ orderId: order.id, adminId: admin.id }),
    ).rejects.toThrow(OrderNotWaitingToBePickedUpError);
  });
});
