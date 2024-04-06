import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { DeliveriesRepository } from '../repositories/deliveries-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface ListDeliveriesNearbyUseCaseProps {
  shipperId: string;
  shipperLatitude: number;
  shipperLongitude: number;
}

@Injectable()
export class ListDeliveriesNearbyUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private shippersRepository: ShippersRepository,
  ) {}

  async execute({
    shipperId,
    shipperLatitude,
    shipperLongitude,
  }: ListDeliveriesNearbyUseCaseProps) {
    const shipperExists = await this.shippersRepository.findById(shipperId);

    if (!shipperExists) {
      throw new ResourceNotFoundError('Shipper');
    }

    const deliveriesNearby = await this.deliveriesRepository.findManyNearby({
      latitude: shipperLatitude,
      longitude: shipperLongitude,
    });

    return { deliveries: deliveriesNearby };
  }
}
