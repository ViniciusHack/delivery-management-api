import { makeDelivery } from 'test/factories/makeDelivery';
import { makeShipper } from 'test/factories/makeDeliveryShipper';
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-delivery-shippers-repository';
import { PickUpDeliveryUseCase } from './pick-up-delivery';

let sut: PickUpDeliveryUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;

describe('Register delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
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
});
