import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeDelivery } from 'test/factories/makeDelivery';
import { makeShipper } from 'test/factories/makeDeliveryShipper';
import { makePhoto } from 'test/factories/makePhoto';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-deliveries-addressees-repository';
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-delivery-shippers-repository';
import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository';
import { DeliveryNotDeliverableError } from '../entities/errors/delivery-not-deliverable';
import { PhotoAlreadyConfirmedError } from '../entities/errors/photo-already-confirmed';
import { DeliverDeliveryUseCase } from './deliver-delivery';

let sut: DeliverDeliveryUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryPhotosRepository: InMemoryPhotosRepository;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;

describe('Register delivery', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddresseesRepository,
    );
    inMemoryShippersRepository = new InMemoryShippersRepository();
    inMemoryPhotosRepository = new InMemoryPhotosRepository();
    sut = new DeliverDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryShippersRepository,
      inMemoryPhotosRepository,
    );
  });

  it('should deliver a delivery', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({
      stage: 'ON_THE_WAY',
      shipperId: shipper.id,
    });

    inMemoryDeliveriesRepository.items.push(delivery);

    const photo = makePhoto();

    inMemoryPhotosRepository.items.push(photo);

    await sut.execute({
      deliveryId: delivery.id,
      shipperId: shipper.id,
      photoId: photo.id,
    });

    const persistedDelivery = inMemoryDeliveriesRepository.items[0];

    expect(persistedDelivery).toEqual(
      expect.objectContaining({
        id: delivery.id,
        stage: 'DELIVERED',
        shipperId: shipper.id,
      }),
    );

    const persistedPhoto = inMemoryPhotosRepository.items[0];

    expect(persistedPhoto).toEqual(
      expect.objectContaining({
        id: photo.id,
        deliveryId: delivery.id,
      }),
    );
  });

  it('should not deliver a delivery if shipper does not exist', async () => {
    const delivery = makeDelivery();

    inMemoryDeliveriesRepository.items.push(delivery);

    const photo = makePhoto();

    inMemoryPhotosRepository.items.push(photo);

    await expect(
      sut.execute({
        deliveryId: delivery.id,
        shipperId: 'invalid-id',
        photoId: photo.id,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not deliver a delivery if delivery does not exist', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const photo = makePhoto();

    inMemoryPhotosRepository.items.push(photo);

    await expect(
      sut.execute({
        deliveryId: 'invalid-id',
        shipperId: shipper.id,
        photoId: photo.id,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not deliver a delivery if photo does not exist', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({ shipperId: shipper.id });

    inMemoryDeliveriesRepository.items.push(delivery);

    await expect(
      sut.execute({
        deliveryId: delivery.id,
        shipperId: shipper.id,
        photoId: 'invalid-id',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should not deliver a delivery if delivery is not on the way stage', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({ stage: 'WAITING', shipperId: shipper.id });

    inMemoryDeliveriesRepository.items.push(delivery);

    const photo = makePhoto();

    inMemoryPhotosRepository.items.push(photo);

    await expect(
      sut.execute({
        deliveryId: delivery.id,
        shipperId: shipper.id,
        photoId: photo.id,
      }),
    ).rejects.toThrowError(DeliveryNotDeliverableError);
  });

  it('should not deliver a delivery if delivery is not assigned to the shipper', async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    inMemoryShippersRepository.items.push(shipper1);
    inMemoryShippersRepository.items.push(shipper2);

    const delivery = makeDelivery({
      stage: 'ON_THE_WAY',
      shipperId: shipper2.id,
    });

    inMemoryDeliveriesRepository.items.push(delivery);

    const photo = makePhoto();

    inMemoryPhotosRepository.items.push(photo);

    await expect(
      sut.execute({
        deliveryId: delivery.id,
        shipperId: shipper1.id,
        photoId: photo.id,
      }),
    ).rejects.toThrowError(NotAllowedError);
  });

  it('should not deliver a delivery if a photo is already confirmed', async () => {
    const shipper = makeShipper();

    inMemoryShippersRepository.items.push(shipper);

    const delivery = makeDelivery({
      stage: 'ON_THE_WAY',
      shipperId: shipper.id,
    });

    inMemoryDeliveriesRepository.items.push(delivery);

    const photo = makePhoto({ deliveryId: delivery.id });

    inMemoryPhotosRepository.items.push(photo);

    await expect(
      sut.execute({
        deliveryId: delivery.id,
        shipperId: shipper.id,
        photoId: photo.id,
      }),
    ).rejects.toThrowError(PhotoAlreadyConfirmedError);
  });
});
