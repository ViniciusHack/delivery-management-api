import { Role } from '@/core/permissions';
import { FakeEncrypter } from 'test/cryptography/fake-encryptor';
import { FakeHashComparer } from 'test/cryptography/fake-hash-comparer';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeShipper } from 'test/factories/makeShipper';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-shippers-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials';

let sut: AuthenticateUseCase;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;
let fakeHashComparer: FakeHashComparer;
let fakeEncrypter: FakeEncrypter;

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    inMemoryShippersRepository = new InMemoryShippersRepository();
    fakeHashComparer = new FakeHashComparer();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryAdminsRepository,
      inMemoryShippersRepository,
      fakeHashComparer,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate an admin', async () => {
    const admin = makeAdmin();
    await inMemoryAdminsRepository.create(admin);

    const result = await sut.execute({
      cpf: admin.cpf.toString(),
      password: admin.password,
    });

    expect(JSON.parse(result.token)).toEqual(
      expect.objectContaining({
        role: Role.Admin,
        sub: admin.id,
      }),
    );
  });

  it('should be able to authenticate a shipper', async () => {
    const shipper = makeShipper();
    await inMemoryShippersRepository.create(shipper);

    const result = await sut.execute({
      cpf: shipper.cpf.toString(),
      password: shipper.password,
    });

    expect(JSON.parse(result.token)).toEqual(
      expect.objectContaining({
        role: Role.Shipper,
        sub: shipper.id,
      }),
    );
  });

  it('should not be able to authenticate with invalid credentials', async () => {
    await expect(
      sut.execute({ cpf: '12345678909', password: 'password' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
