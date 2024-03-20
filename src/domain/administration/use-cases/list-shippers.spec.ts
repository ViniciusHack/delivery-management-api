import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeShipper } from 'test/factories/makeShipper';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-shippers-repository';
import { ListShippersUseCase } from './list-shippers';

let sut: ListShippersUseCase;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('List shippers', () => {
  beforeEach(() => {
    inMemoryShippersRepository = new InMemoryShippersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new ListShippersUseCase(
      inMemoryShippersRepository,
      inMemoryAdminsRepository,
    );
  });

  it('should be able to list shippers', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    const { shippers } = await sut.execute({ adminId: admin.id });
    expect(shippers).toHaveLength(2);
    expect(shippers).toEqual(
      expect.arrayContaining([
        expect.objectContaining(shipper1),
        expect.objectContaining(shipper2),
      ]),
    );
  });

  it('should not be able to list shippers', async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    await expect(sut.execute({ adminId: 'non-existing-id' })).rejects.toThrow(
      NotAllowedError,
    );
  });

  it('should be able to list shippers with pagination', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    for (let i = 1; i < 10; i++) {
      const shipper = makeShipper({
        password: `shipper-${i}`,
      });
      await inMemoryShippersRepository.create(shipper);
    }

    const { shippers } = await sut.execute({
      adminId: admin.id,
      perPage: 5,
      page: 2,
    });
    expect(shippers).toHaveLength(4);
    expect(shippers[0].password).toBe('shipper-6');
    expect(shippers[3].password).toBe('shipper-9');
  });
});
