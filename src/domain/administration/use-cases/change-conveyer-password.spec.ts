import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { FakeHashComparer } from 'test/cryptography/fake-hash-comparer';
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeShipper } from 'test/factories/makeShipper';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-shippers-repository';
import { ChangeShipperPasswordUseCase } from './change-shipper-password';
import { InvalidCredentialsError } from './errors/invalid-credentials';

let sut: ChangeShipperPasswordUseCase;
let inMemoryShippersRepository: InMemoryShippersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHashComparer: FakeHashComparer;
let fakeHashGenerator: FakeHashGenerator;

describe(`Change shipper's password`, () => {
  beforeEach(() => {
    inMemoryShippersRepository = new InMemoryShippersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHashComparer = new FakeHashComparer();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new ChangeShipperPasswordUseCase(
      inMemoryShippersRepository,
      inMemoryAdminsRepository,
      fakeHashComparer,
      fakeHashGenerator,
    );
  });

  it(`should change a shipper's password`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const shipper = makeShipper({
      password: '123456',
    });

    await inMemoryShippersRepository.create(shipper);

    await sut.execute({
      newPassword: 'new-password',
      oldPassword: '123456',
      shipperId: shipper.id,
      adminId: admin.id,
    });

    const persistedShipper = await inMemoryShippersRepository.findById(
      shipper.id,
    );
    expect(persistedShipper?.password).toEqual(`hashed:new-password`);
  });

  it(`should not be able to change a shipper's password with an invalid admin`, async () => {
    const shipper = makeShipper({
      password: '123456',
    });

    await inMemoryShippersRepository.create(shipper);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: '123456',
        shipperId: shipper.id,
        adminId: 'invalid-admin-id',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it(`should not be able to change a the password of an inexistent shipper`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: '123456',
        shipperId: 'invalid-shipper-id',
        adminId: admin.id,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it(`should not be able to change a shipper's password when the password doesn't match`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const shipper = makeShipper({
      password: '123456',
    });

    await inMemoryShippersRepository.create(shipper);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: 'invalid-old-password',
        shipperId: shipper.id,
        adminId: admin.id,
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
