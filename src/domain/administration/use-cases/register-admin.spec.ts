import { ConflictError } from '@/core/errors/conflict-error';
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InvalidCpfError } from '../entities/errors/invalid-cpf';
import { Cpf } from '../entities/value-objects/cpf';
import { RegisterAdminUseCase } from './register-admin';

let sut: RegisterAdminUseCase;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHashGenerator: FakeHashGenerator;

describe('Register admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHashGenerator);
  });

  it('should register a new admin', async () => {
    const cpf = '12345678909';
    const password = 'password';

    await sut.execute({ cpf, password });

    const admin = await inMemoryAdminsRepository.findByCpf(new Cpf(cpf));
    expect(admin?.password).toEqual(`hashed:${password}`);
  });

  it('should not register an admin with an already registered cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({ cpf: admin.cpf.toString(), password: admin.password }),
    ).rejects.toThrow(ConflictError);
  });

  it('should not register an admin with an invalid cpf', async () => {
    const cpf = '004-247-709-3';
    const password = 'password';

    await expect(sut.execute({ cpf, password })).rejects.toThrow(
      InvalidCpfError,
    );
  });
});
