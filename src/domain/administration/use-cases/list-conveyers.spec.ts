import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeConveyer } from 'test/factories/makeConveyer';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryConveyersRepository } from 'test/repositories/in-memory-conveyers-repository';
import { ListConveyersUseCase } from './list-conveyers';

let sut: ListConveyersUseCase;
let inMemoryConveyersRepository: InMemoryConveyersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('List conveyers', () => {
  beforeEach(() => {
    inMemoryConveyersRepository = new InMemoryConveyersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new ListConveyersUseCase(
      inMemoryConveyersRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should be able to list conveyers', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const conveyer1 = makeConveyer();
    const conveyer2 = makeConveyer();

    await inMemoryConveyersRepository.create(conveyer1);
    await inMemoryConveyersRepository.create(conveyer2);

    const { conveyers } = await sut.execute({ adminId: admin.id });
    expect(conveyers).toHaveLength(2);
    expect(conveyers).toEqual(
      expect.arrayContaining([
        expect.objectContaining(conveyer1),
        expect.objectContaining(conveyer2),
      ]),
    );
  });

  it('should not be able to list conveyers', async () => {
    const conveyer1 = makeConveyer();
    const conveyer2 = makeConveyer();

    await inMemoryConveyersRepository.create(conveyer1);
    await inMemoryConveyersRepository.create(conveyer2);

    await expect(sut.execute({ adminId: 'non-existing-id' })).rejects.toThrow(
      NotAllowedError,
    );
  });

  it('should be able to list conveyers with pagination', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    for (let i = 1; i < 10; i++) {
      const conveyer = makeConveyer({
        password: `conveyer-${i}`,
      });
      await inMemoryConveyersRepository.create(conveyer);
    }

    const { conveyers } = await sut.execute({
      adminId: admin.id,
      perPage: 5,
      page: 2,
    });
    expect(conveyers).toHaveLength(4);
    expect(conveyers[0].password).toBe('conveyer-6');
    expect(conveyers[3].password).toBe('conveyer-9');
  });
});
