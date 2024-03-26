import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AdminsRepository } from '../repositories/admins-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface DeleteOrderUseCaseProps {
  adminId: string;
  orderId: string;
}

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({ adminId, orderId }: DeleteOrderUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const orderExists = await this.ordersRepository.findById(orderId);
    if (!orderExists) {
      throw new ResourceNotFoundError('Order');
    }

    await this.ordersRepository.delete(orderId);
  }
}
