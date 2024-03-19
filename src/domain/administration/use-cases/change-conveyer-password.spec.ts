import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { FakeHashComparer } from 'test/cryptography/fake-hash-comparer';
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeConveyer } from 'test/factories/makeConveyer';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryConveyersRepository } from 'test/repositories/in-memory-conveyers-repository';
import { ChangeConveyerPasswordUseCase } from './change-conveyer-password';
import { InvalidCredentialsError } from './errors/invalid-credentials';

let sut: ChangeConveyerPasswordUseCase;
let inMemoryConveyersRepository: InMemoryConveyersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHashComparer: FakeHashComparer;
let fakeHashGenerator: FakeHashGenerator;

describe(`Change conveyer's password`, () => {
  beforeEach(() => {
    inMemoryConveyersRepository = new InMemoryConveyersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHashComparer = new FakeHashComparer();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new ChangeConveyerPasswordUseCase(
      inMemoryConveyersRepository,
      inMemoryAdminsRepository,
      fakeHashComparer,
      fakeHashGenerator,
    );
  });

  it(`should change a conveyer's password`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const conveyer = makeConveyer({
      password: '123456',
    });

    await inMemoryConveyersRepository.create(conveyer);

    await sut.execute({
      newPassword: 'new-password',
      oldPassword: '123456',
      conveyerId: conveyer.id,
      adminId: admin.id,
    });

    const conveyerPersisted = await inMemoryConveyersRepository.findById(
      conveyer.id,
    );
    expect(conveyerPersisted?.password).toEqual(`hashed:new-password`);
  });

  it(`should not be able to change a conveyer's password with an invalid admin`, async () => {
    const conveyer = makeConveyer({
      password: '123456',
    });

    await inMemoryConveyersRepository.create(conveyer);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: '123456',
        conveyerId: conveyer.id,
        adminId: 'invalid-admin-id',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it(`should not be able to change a the password of an inexistent conveyer`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: '123456',
        conveyerId: 'invalid-conveyer-id',
        adminId: admin.id,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it(`should not be able to change a conveyer's password when the password doesn't match`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const conveyer = makeConveyer({
      password: '123456',
    });

    await inMemoryConveyersRepository.create(conveyer);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: 'invalid-old-password',
        conveyerId: conveyer.id,
        adminId: admin.id,
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
