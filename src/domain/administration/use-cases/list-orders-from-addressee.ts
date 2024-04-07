import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order';
import { AddresseesRepository } from '../repositories/addressees-repository';
import { AdminsRepository } from '../repositories/admins-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface ListOrdersFromAddresseeUseCaseProps {
  adminId: string;
  addresseeId: string;
}

@Injectable()
export class ListOrdersFromAddresseeUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
    private addresseesRepository: AddresseesRepository,
  ) {}

  async execute({
    adminId,
    addresseeId,
  }: ListOrdersFromAddresseeUseCaseProps): Promise<{ orders: Order[] }> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const addresseeExists = await this.addresseesRepository.findById(
      addresseeId,
    );

    if (!addresseeExists) {
      throw new ResourceNotFoundError('Addressee');
    }

    const orders = await this.ordersRepository.findManyByAddresseeId(
      addresseeId,
    );

    return { orders };
  }
}
