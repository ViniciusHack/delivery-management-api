import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeDelivery } from 'test/factories/makeDelivery';
import { makeShipper } from 'test/factories/makeDeliveryShipper';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-deliveries-addressees-repository';
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-delivery-shippers-repository';
import { DeliveryNotWaitingPickUpError } from '../entities/errors/delivery-not-waiting-for-pick-up';
import { PickUpDeliveryUseCase } from './pick-up-delivery';

let sut: PickUpDeliveryUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;

describe('Pick up delivery', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddresseesRepository,
    );
    inMemoryShippersRepository = new InMemoryShippersRepository();
    sut = new PickUpDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryShippersRepository,
    );
  });

  it('should pick up a delivery', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery();

    inMemoryDeliveriesRepository.items.push(delivery);

    await sut.execute({ deliveryId: delivery.id, shipperId: shipper.id });

    const persistedDelivery = inMemoryDeliveriesRepository.items[0];

    expect(persistedDelivery).toEqual(
      expect.objectContaining({
        id: delivery.id,
        stage: 'ON_THE_WAY',
        shipperId: shipper.id,
      }),
    );
  });

  it('should not pick up a delivery if shipper does not exist', async () => {
    const delivery = makeDelivery();

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({ deliveryId: delivery.id, shipperId: 'invalid-id' }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not pick up a delivery if delivery does not exist', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    await expect(
      sut.execute({ deliveryId: 'invalid-id', shipperId: shipper.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not pick up a delivery if delivery is not in waiting stage', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({ stage: 'ON_THE_WAY' });

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({ deliveryId: delivery.id, shipperId: shipper.id }),
    ).rejects.toThrowError(DeliveryNotWaitingPickUpError);
  });
});
