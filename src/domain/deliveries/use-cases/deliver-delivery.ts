import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveriesRepository } from '../repositories/deliveries-repository';
import { PhotosRepository } from '../repositories/photos-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface DeliverDeliveryUseCaseProps {
  deliveryId: string;
  shipperId: string;
  photoId: string;
}

export class DeliverDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private shippersRepository: ShippersRepository,
    private photosRepository: PhotosRepository,
  ) {}

  async execute({
    deliveryId,
    shipperId,
    photoId,
  }: DeliverDeliveryUseCaseProps): Promise<void> {
    const delivery = await this.deliveriesRepository.findById(deliveryId);

    if (!delivery) {
      throw new ResourceNotFoundError('Delivery');
    }

    const shipperExists = await this.shippersRepository.findById(shipperId);

    if (!shipperExists) {
      throw new ResourceNotFoundError('Shipper');
    }

    if (delivery.shipperId !== shipperId) {
      throw new NotAllowedError();
    }

    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new ResourceNotFoundError('Photo');
    }

    photo.confirmPhoto(deliveryId);
    delivery.deliver();

    await this.photosRepository.update(photo);
    await this.deliveriesRepository.update(delivery);
  }
}
