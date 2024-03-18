import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { Conveyer } from '../entities/conveyer';
import { AdminsRepository } from '../repositories/admins-repository';
import { ConveyersRepository } from '../repositories/conveyers-repository';

interface ListConveyersUseCaseProps {
  adminId: string;
  page?: number;
  perPage?: number;
}

export class ListConveyersUseCase {
  constructor(
    private conveyersRepository: ConveyersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    page = 1,
    perPage = 10,
  }: ListConveyersUseCaseProps): Promise<{ conveyers: Conveyer[] }> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const conveyers = await this.conveyersRepository.findMany({
      page,
      perPage,
    });

    return { conveyers };
  }
}
