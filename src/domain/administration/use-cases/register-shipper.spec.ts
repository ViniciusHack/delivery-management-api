import { ConflictError } from '@/core/errors/conflict-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeShipper } from 'test/factories/makeShipper';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-shippers-repository';
import { InvalidCpfError } from '../entities/errors/invalid-cpf';
import { Cpf } from '../entities/value-objects/cpf';
import { RegisterShipperUseCase } from './register-shipper';

let sut: RegisterShipperUseCase;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHashGenerator: FakeHashGenerator;

describe('Register shipper', () => {
  beforeEach(() => {
    inMemoryShippersRepository = new InMemoryShippersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new RegisterShipperUseCase(
      inMemoryShippersRepository,
      inMemoryAdminsRepository,
      fakeHashGenerator,
    );
  });

  it('should register a new shipper', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const cpf = '12345678909';
    const password = 'password';

    await sut.execute({ cpf, password, adminId: admin.id });

    const shipper = await inMemoryShippersRepository.findByCpf(new Cpf(cpf));
    expect(shipper?.password).toEqual(`hashed:${password}`);
  });

  it('should not register an shipper with an already registered cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const shipper = makeShipper();
    inMemoryShippersRepository.create(shipper);

    await expect(
      sut.execute({
        cpf: shipper.cpf.toString(),
        password: shipper.password,
        adminId: admin.id,
      }),
    ).rejects.toThrow(ConflictError);
  });

  it('should not register an shipper with an invalid cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const cpf = '004-247-709-3';
    const password = 'password';

    await expect(
      sut.execute({ cpf, password, adminId: admin.id }),
    ).rejects.toThrow(InvalidCpfError);
  });

  it('should not be able to register a shipper with an invalid admin', async () => {
    const cpf = '12345678909';
    const password = 'password';

    await expect(
      sut.execute({ cpf, password, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });
});
