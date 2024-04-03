import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { DeliveriesRepository } from '../repositories/deliveries-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface PickUpDeliveryUseCaseProps {
  deliveryId: string;
  shipperId: string;
}

@Injectable()
export class PickUpDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private shippersRepository: ShippersRepository,
  ) {}

  async execute({
    deliveryId,
    shipperId,
  }: PickUpDeliveryUseCaseProps): Promise<void> {
    const delivery = await this.deliveriesRepository.findById(deliveryId);

    if (!delivery) {
      throw new ResourceNotFoundError('Delivery');
    }

    const shipperExists = await this.shippersRepository.findById(shipperId);

    if (!shipperExists) {
      throw new ResourceNotFoundError('Shipper');
    }

    delivery.pickUp(shipperId);

    await this.deliveriesRepository.update(delivery);
  }
}
