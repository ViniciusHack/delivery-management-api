import { Addressee } from '@/domain/administration/entities/addressee';
import { Address } from '@/domain/administration/entities/value-objects/address';
import { PrismaAddresseeMapper } from '@/infra/database/prisma/mappers/prisma-addressee-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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
    email: faker.internet.email(),
    ...override,
  });
}

@Injectable()
export class AddresseeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddressee(data?: Partial<Addressee>) {
    const addressee = makeAddressee(data);

    await this.prisma.addressee.create({
      data: PrismaAddresseeMapper.toPersistence(addressee),
    });

    return addressee;
  }
}
