import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeDelivery } from 'test/factories/makeDelivery';
import { makeShipper } from 'test/factories/makeDeliveryShipper';
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-delivery-shippers-repository';
import { DeliveryNotReturnableError } from '../entities/errors/delivery-not-returnable';
import { ReturnDeliveryUseCase } from './return-delivery';

let sut: ReturnDeliveryUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;

describe('Return delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
    inMemoryShippersRepository = new InMemoryShippersRepository();
    sut = new ReturnDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryShippersRepository,
    );
  });

  it('should be able to mark a delivery as returned', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({
      stage: 'ON_THE_WAY',
      shipperId: shipper.id,
    });

    inMemoryDeliveriesRepository.items.push(delivery);

    await sut.execute({ deliveryId: delivery.id, shipperId: shipper.id });

    const persistedDelivery = inMemoryDeliveriesRepository.items[0];

    expect(persistedDelivery).toEqual(
      expect.objectContaining({
        id: delivery.id,
        stage: 'RETURNED',
        shipperId: shipper.id,
      }),
    );
  });

  it('should not return a delivery if shipper does not exist', async () => {
    const delivery = makeDelivery();

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({ deliveryId: delivery.id, shipperId: 'invalid-id' }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not return a delivery if delivery does not exist', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    await expect(
      sut.execute({ deliveryId: 'invalid-id', shipperId: shipper.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not return a delivery if delivery is not on the way stage', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({ stage: 'WAITING', shipperId: shipper.id });

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({ deliveryId: delivery.id, shipperId: shipper.id }),
    ).rejects.toThrowError(DeliveryNotReturnableError);
  });

  it('should not return a delivery if delivery is not assigned to the shipper', async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    inMemoryShippersRepository.items.push(shipper1);
    inMemoryShippersRepository.items.push(shipper2);

    const delivery = makeDelivery({
      stage: 'ON_THE_WAY',
      shipperId: shipper2.id,
    });

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({ deliveryId: delivery.id, shipperId: shipper1.id }),
    ).rejects.toThrowError(NotAllowedError);
  });
});
