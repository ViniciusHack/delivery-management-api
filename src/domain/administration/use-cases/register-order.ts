import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { HashGenerator } from '../cryptography/hashGenerator';
import { Order } from '../entities/order';
import { AddresseesRepository } from '../repositories/addressees-repository';
import { AdminsRepository } from '../repositories/admins-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface RegisterOrderUseCaseProps {
  addresseeId: string;
  adminId: string;
}

export class RegisterOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
    private addresseeRepository: AddresseesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    addresseeId,
    adminId,
  }: RegisterOrderUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const addresseeExists = await this.addresseeRepository.findById(
      addresseeId,
    );

    if (!addresseeExists) {
      throw new ResourceNotFoundError('Addressee');
    }

    const order = new Order({ addresseeId });

    await this.ordersRepository.create(order);
  }
}
