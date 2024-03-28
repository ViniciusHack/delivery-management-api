import { Admin } from '@/domain/administration/entities/admin';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAdmin(override?: Partial<Admin>): Admin {
  return new Admin({
    cpf: new Cpf('12345678909'),
    password: faker.lorem.word(),
    ...override,
  });
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<Admin>) {
    const admin = makeAdmin(data);

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPersistence(admin),
    });

    return admin;
  }
}
