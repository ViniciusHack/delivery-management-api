import { faker } from '@faker-js/faker';
import { makeDelivery } from 'test/factories/makeDelivery';
import { makeShipper } from 'test/factories/makeDeliveryShipper';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-deliveries-addressees-repository';
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-delivery-shippers-repository';
import { Addressee } from '../entities/addressee';
import { Address } from '../entities/value-objects/address';
import { ListDeliveriesNearbyUseCase } from './list-deliveries-nearby';

let sut: ListDeliveriesNearbyUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;

describe('List deliveries nearby', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddresseesRepository,
    );
    inMemoryShippersRepository = new InMemoryShippersRepository();
    sut = new ListDeliveriesNearbyUseCase(
      inMemoryDeliveriesRepository,
      inMemoryShippersRepository,
    );
  });

  it('should list deliveries nearby', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const addressee1 = new Addressee({
      address: new Address({
        city: faker.location.city(),
        neighborhood: faker.location.county(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
        latitude: -22.9173846,
        longitude: -47.0903139,
      }),
    });

    const addressee2 = new Addressee({
      address: new Address({
        city: faker.location.city(),
        neighborhood: faker.location.county(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
        latitude: -18.9173846,
        longitude: -44.0903139,
      }),
    });

    inMemoryAddresseesRepository.items.push(addressee1);
    inMemoryAddresseesRepository.items.push(addressee2);

    const delivery1 = makeDelivery({
      addresseeId: addressee1.id,
    });

    const delivery2 = makeDelivery({
      addresseeId: addressee2.id,
    });

    inMemoryDeliveriesRepository.items.push(delivery1);
    inMemoryDeliveriesRepository.items.push(delivery2);

    const { deliveries } = await sut.execute({
      shipperId: shipper.id,
      shipperLatitude: -22.918111,
      shipperLongitude: -47.09086,
    });

    expect(deliveries).toHaveLength(1);
    expect(deliveries).toEqual([
      expect.objectContaining({
        id: delivery1.id,
      }),
    ]);
  });

  it('should not list deliveries nearby if shipper does not exist', async () => {
    const delivery = makeDelivery();

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({
        shipperId: 'invalid-id',
        shipperLatitude: -22.918111,
        shipperLongitude: -47.09086,
      }),
    ).rejects.toThrow(Error);
  });
});
