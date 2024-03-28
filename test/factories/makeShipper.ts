import { Shipper } from '@/domain/administration/entities/shipper';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { PrismaShipperMapper } from '@/infra/database/prisma/mappers/prisma-shipper-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeShipper(override?: Partial<Shipper>): Shipper {
  return new Shipper({
    cpf: new Cpf('12345678909'),
    password: faker.lorem.word(),
    ...override,
  });
}

@Injectable()
export class ShipperFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaShipper(data?: Partial<Shipper>) {
    const shipper = makeShipper(data);

    await this.prisma.user.create({
      data: PrismaShipperMapper.toPersistence(shipper),
    });

    return shipper;
  }
}
