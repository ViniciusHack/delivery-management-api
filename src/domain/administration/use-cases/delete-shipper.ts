import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AdminsRepository } from '../repositories/admins-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface DeleteShipperUseCaseProps {
  adminId: string;
  shipperId: string;
}

export class DeleteShipperUseCase {
  constructor(
    private shippersRepository: ShippersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    shipperId,
  }: DeleteShipperUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const shipperExists = await this.shippersRepository.findById(shipperId);
    if (!shipperExists) {
      throw new ResourceNotFoundError('Shipper');
    }

    await this.shippersRepository.delete(shipperId);
  }
}
