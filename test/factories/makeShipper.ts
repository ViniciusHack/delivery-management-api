import { Shipper } from '@/domain/administration/entities/shipper';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { faker } from '@faker-js/faker';

export function makeShipper(override?: Partial<Shipper>): Shipper {
  return new Shipper({
    cpf: new Cpf('12345678909'),
    password: faker.lorem.word(),
    ...override,
  });
}
