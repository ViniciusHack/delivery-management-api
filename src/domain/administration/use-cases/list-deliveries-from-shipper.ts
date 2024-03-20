import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Order } from '../entities/order';
import { AdminsRepository } from '../repositories/admins-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface ListDeliveriesFromShipperUseCaseProps {
  adminId?: string;
  targetShipperId: string;
  requestingShipperId?: string;
  page?: number;
  perPage?: number;
}

export class ListDeliveriesFromShipperUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    targetShipperId,
    requestingShipperId,
    page = 1,
    perPage = 10,
  }: ListDeliveriesFromShipperUseCaseProps): Promise<{ deliveries: Order[] }> {
    const isRequestingShipper = requestingShipperId === targetShipperId;

    if (!isRequestingShipper && !adminId) {
      throw new NotAllowedError();
    }

    if (adminId) {
      const adminExists = await this.adminsRepository.findById(adminId);

      if (!adminExists) {
        throw new NotAllowedError();
      }
    }

    const deliveries = await this.ordersRepository.findManyByShipperId({
      shipperId: targetShipperId,
      page,
      perPage,
    });

    return { deliveries };
  }
}
