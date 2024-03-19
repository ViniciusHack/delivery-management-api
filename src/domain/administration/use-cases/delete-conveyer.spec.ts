import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeConveyer } from 'test/factories/makeConveyer';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryConveyersRepository } from 'test/repositories/in-memory-conveyers-repository';
import { DeleteConveyerUseCase } from './delete-conveyer';

let sut: DeleteConveyerUseCase;
let inMemoryConveyersRepository: InMemoryConveyersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('Delete conveyer', () => {
  beforeEach(() => {
    inMemoryConveyersRepository = new InMemoryConveyersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new DeleteConveyerUseCase(
      inMemoryConveyersRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should delete a conveyer', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const conveyer = makeConveyer();
    inMemoryConveyersRepository.create(conveyer);

    await sut.execute({
      adminId: admin.id,
      conveyerId: conveyer.id,
    });

    const persistedConveyer = await inMemoryConveyersRepository.findById(
      conveyer.id,
    );
    expect(persistedConveyer).toBeNull();
  });

  it('should not be able to delete a conveyer with an invalid admin', async () => {
    const conveyer = makeConveyer();
    inMemoryConveyersRepository.create(conveyer);

    await expect(
      sut.execute({ conveyerId: conveyer.id, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to delete a conveyer that does not exist', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({ conveyerId: 'invalid-conveyer-id', adminId: admin.id }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
