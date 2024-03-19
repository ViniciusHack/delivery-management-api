import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { makeOrder } from 'test/factories/makeOrder';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { GetOrderUseCase } from './get-order';

let sut: GetOrderUseCase;
let inMemoryOrdersRepository: InMemoryOrdersRepository;

describe('Get order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new GetOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to get orders', async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const { order: orderDetails } = await sut.execute({ orderId: order.id });
    expect(orderDetails).toEqual(expect.objectContaining(order));
  });

  it('should not be able to get an inexistent order', async () => {
    await expect(
      sut.execute({ orderId: 'non-existing-order-id' }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
