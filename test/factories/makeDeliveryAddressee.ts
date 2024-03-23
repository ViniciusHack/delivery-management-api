import { Addressee } from '@/domain/administration/entities/addressee';
import { Address } from '@/domain/administration/entities/value-objects/address';
import { faker } from '@faker-js/faker';

export function makeAddressee(override?: Partial<Addressee>): Addressee {
  return new Addressee({
    address: new Address({
      city: faker.location.city(),
      neighborhood: faker.location.county(),
      number: faker.location.buildingNumber(),
      state: faker.location.state(),
      street: faker.location.street(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    }),
    ...override,
  });
}
