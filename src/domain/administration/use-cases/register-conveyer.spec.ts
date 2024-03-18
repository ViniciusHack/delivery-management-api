import { ConflictError } from '@/domain/core/errors/conflict-error';
import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeConveyer } from 'test/factories/makeConveyer';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryConveyersRepository } from 'test/repositories/in-memory-conveyers-repository';
import { InvalidCpfError } from '../entities/errors/invalid-cpf';
import { Cpf } from '../entities/value-objects/cpf';
import { RegisterConveyerUseCase } from './register-conveyer';

let sut: RegisterConveyerUseCase;
let inMemoryConveyersRepository: InMemoryConveyersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHashGenerator: FakeHashGenerator;

describe('Register conveyer', () => {
  beforeEach(() => {
    inMemoryConveyersRepository = new InMemoryConveyersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new RegisterConveyerUseCase(
      inMemoryConveyersRepository,
      inMemoryAdminsRepository,
      fakeHashGenerator,
    );
  });

  it('should register a new conveyer', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const cpf = '12345678909';
    const password = 'password';

    await sut.execute({ cpf, password, adminId: admin.id });

    const conveyer = await inMemoryConveyersRepository.findByCpf(new Cpf(cpf));
    expect(conveyer?.password).toEqual(`hashed:${password}`);
  });

  it('should not register an conveyer with an already registered cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const conveyer = makeConveyer();
    inMemoryConveyersRepository.create(conveyer);

    await expect(
      sut.execute({
        cpf: conveyer.cpf.toString(),
        password: conveyer.password,
        adminId: admin.id,
      }),
    ).rejects.toThrow(ConflictError);
  });

  it('should not register an conveyer with an invalid cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const cpf = '004-247-709-3';
    const password = 'password';

    await expect(
      sut.execute({ cpf, password, adminId: admin.id }),
    ).rejects.toThrow(InvalidCpfError);
  });

  it('should not be able to register a conveyer with an invalid admin', async () => {
    const cpf = '12345678909';
    const password = 'password';

    await expect(
      sut.execute({ cpf, password, adminId: 'invalid-admin-id' }),
    ).rejects.toThrow(NotAllowedError);
  });
});
