import { Conveyer } from '@/domain/administration/entities/conveyer';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { faker } from '@faker-js/faker';

export function makeConveyer(override?: Partial<Conveyer>): Conveyer {
  return new Conveyer({
    cpf: new Cpf('12345678909'),
    password: faker.lorem.word(),
    ...override,
  });
}
