import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DomainEvents } from '@/core/events/domain-events';
import { Injectable } from '@nestjs/common';
import { DeliveryReturnedEvent } from '../events/delivery-returned-event';
import { DeliveriesRepository } from '../repositories/deliveries-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface ReturnDeliveryUseCaseProps {
  deliveryId: string;
  shipperId: string;
}

@Injectable()
export class ReturnDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private shippersRepository: ShippersRepository,
  ) {}

  async execute({
    deliveryId,
    shipperId,
  }: ReturnDeliveryUseCaseProps): Promise<void> {
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

    delivery.return();

    await this.deliveriesRepository.update(delivery);

    DomainEvents.dispatch(new DeliveryReturnedEvent(delivery));
  }
}
