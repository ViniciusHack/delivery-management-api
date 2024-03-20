import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Shipper } from '../entities/shipper';
import { AdminsRepository } from '../repositories/admins-repository';
import { ShippersRepository } from '../repositories/shippers-repository';

interface ListShippersUseCaseProps {
  adminId: string;
  page?: number;
  perPage?: number;
}

export class ListShippersUseCase {
  constructor(
    private shippersRepository: ShippersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    page = 1,
    perPage = 10,
  }: ListShippersUseCaseProps): Promise<{ shippers: Shipper[] }> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const shippers = await this.shippersRepository.findMany({
      page,
      perPage,
    });

    return { shippers };
  }
}
