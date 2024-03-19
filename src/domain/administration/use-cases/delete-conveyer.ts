import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { AdminsRepository } from '../repositories/admins-repository';
import { ConveyersRepository } from '../repositories/conveyers-repository';

interface DeleteConveyerUseCaseProps {
  adminId: string;
  conveyerId: string;
}

export class DeleteConveyerUseCase {
  constructor(
    private conveyersRepository: ConveyersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    conveyerId,
  }: DeleteConveyerUseCaseProps): Promise<void> {
    const adminExists = await this.adminsRepository.findById(adminId);

    if (!adminExists) {
      throw new NotAllowedError();
    }

    const conveyerExists = await this.conveyersRepository.findById(conveyerId);
    if (!conveyerExists) {
      throw new ResourceNotFoundError('Conveyer');
    }

    await this.conveyersRepository.delete(conveyerId);
  }
}
