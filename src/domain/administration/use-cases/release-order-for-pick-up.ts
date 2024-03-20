import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AdminsRepository } from '../repositories/admins-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface ReleaseOrderForPickUpUseCaseProps {
  adminId: string;
  orderId: string;
}

export class ReleaseOrderForPickUpUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    orderId,
  }: ReleaseOrderForPickUpUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError('Order');
    }

    order.ready();

    await this.ordersRepository.update(order);
  }
}
