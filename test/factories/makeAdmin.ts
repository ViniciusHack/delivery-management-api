import { Admin } from '@/domain/administration/entities/admin';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { faker } from '@faker-js/faker';

export function makeAdmin(override?: Admin): Admin {
  return new Admin({
    cpf: new Cpf('12345678909'),
    password: faker.lorem.word(),
    ...override,
  });
}
