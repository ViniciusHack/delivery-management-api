import { ConflictError } from 'src/domain/core/errors/conflict-error';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { Admin } from '../entities/admin';
import { Cpf } from '../entities/value-objects/cpf';
import { RegisterAdminUseCase } from './register-admin';

let sut: RegisterAdminUseCase;
let inMemoryAdminsRepository: InMemoryAdminsRepository;

describe('Register admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new RegisterAdminUseCase(inMemoryAdminsRepository);
  });

  it('should register a new admin', async () => {
    const cpf = '004-247-709-38';
    const password = 'password';

    await sut.execute({ cpf, password });

    const admin = await inMemoryAdminsRepository.findByCpf(new Cpf(cpf));
    expect(admin).not.toBeNull();
  });

  it('should not register an admin with an already registered cpf', async () => {
    const cpf = '004-247-709-38';
    const password = 'password';

    inMemoryAdminsRepository.create(new Admin({ cpf: new Cpf(cpf), password }));

    await expect(sut.execute({ cpf, password })).rejects.toThrow(ConflictError);
  });

  it('should not register an admin with an invalid cpf', async () => {
    const cpf = '004-247-709-3';
    const password = 'password';

    await expect(sut.execute({ cpf, password })).rejects.toThrow();
  });
});
