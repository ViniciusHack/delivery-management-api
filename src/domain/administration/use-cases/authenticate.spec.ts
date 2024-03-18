import { permissions } from '@/domain/core/permissions';
import { FakeEncrypter } from 'test/cryptography/fake-encryptor';
import { FakeHashComparer } from 'test/cryptography/fake-hash-comparer';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryConveyersRepository } from 'test/repositories/in-memory-conveyers-repository';
import { Admin } from '../entities/admin';
import { Conveyer } from '../entities/conveyer';
import { Cpf } from '../entities/value-objects/cpf';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials';

let sut: AuthenticateUseCase;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let inMemoryConveyersRepository: InMemoryConveyersRepository;
let fakeHashComparer: FakeHashComparer;
let fakeEncrypter: FakeEncrypter;

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    inMemoryConveyersRepository = new InMemoryConveyersRepository();
    fakeHashComparer = new FakeHashComparer();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryAdminsRepository,
      inMemoryConveyersRepository,
      fakeHashComparer,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate an admin', async () => {
    const cpf = '12345678909';
    const password = 'password';
    const admin = new Admin({ cpf: new Cpf(cpf), password });
    await inMemoryAdminsRepository.create(admin);

    const result = await sut.execute({ cpf, password });

    expect(JSON.parse(result.token)).toEqual(
      expect.objectContaining({
        role: 'admin',
        sub: admin.id,
        permissions: permissions.admin,
      }),
    );
  });

  it('should be able to authenticate a conveyer', async () => {
    const cpf = '12345678909';
    const password = 'password';
    const conveyer = new Conveyer({ cpf: new Cpf(cpf), password });
    await inMemoryConveyersRepository.create(conveyer);

    const result = await sut.execute({ cpf, password });

    expect(JSON.parse(result.token)).toEqual(
      expect.objectContaining({
        role: 'admin',
        sub: conveyer.id,
        permissions: permissions.conveyer,
      }),
    );
  });

  it('should not be able to authenticate with invalid credentials', async () => {
    await expect(
      sut.execute({ cpf: '12345678909', password: 'password' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
