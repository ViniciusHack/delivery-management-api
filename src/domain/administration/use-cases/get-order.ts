import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order';
import { OrdersRepository } from '../repositories/orders-repository';

interface GetOrderUseCaseProps {
  orderId: string;
}

@Injectable()
export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ orderId }: GetOrderUseCaseProps): Promise<{ order: Order }> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new ResourceNotFoundError('Order');
    }

    return { order };
  }
}
