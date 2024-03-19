import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { FakeHashComparer } from 'test/cryptography/fake-hash-comparer';
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator';
import { makeAdmin } from 'test/factories/makeAdmin';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';

import { ChangeAdminPasswordUseCase } from './change-admin-password';
import { InvalidCredentialsError } from './errors/invalid-credentials';

let sut: ChangeAdminPasswordUseCase;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHashComparer: FakeHashComparer;
let fakeHashGenerator: FakeHashGenerator;

describe(`Change admin's password`, () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    fakeHashComparer = new FakeHashComparer();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new ChangeAdminPasswordUseCase(
      inMemoryAdminsRepository,
      fakeHashComparer,
      fakeHashGenerator,
    );
  });

  it(`should change a admin's password`, async () => {
    const admin = makeAdmin({
      password: '123456',
    });

    await inMemoryAdminsRepository.create(admin);

    await sut.execute({
      newPassword: 'new-password',
      oldPassword: '123456',
      adminId: admin.id,
    });

    const persistedAdmin = await inMemoryAdminsRepository.findById(admin.id);
    expect(persistedAdmin?.password).toEqual(`hashed:new-password`);
  });

  it(`should not be able to change a the password of an inexistent admin`, async () => {
    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: '123456',
        adminId: 'invalid-admin-id',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it(`should not be able to change a admin's password when the password doesn't match`, async () => {
    const admin = makeAdmin({
      password: '123456',
    });

    await inMemoryAdminsRepository.create(admin);

    await expect(
      sut.execute({
        newPassword: 'new-password',
        oldPassword: 'invalid-old-password',
        adminId: admin.id,
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
