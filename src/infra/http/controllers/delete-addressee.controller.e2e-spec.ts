import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';
import { AdminFactory } from 'test/factories/makeAdmin';

describe(`Delete addressee (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let addresseeFactory: AddresseeFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /addressees', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      cpf: new Cpf('85344414056'),
    });

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    const response = await request(app.getHttpServer())
      .delete(`/addressees/${addressee.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);

    const addresseeOnDatabase = await prisma.addressee.findUnique({
      where: {
        id: addressee.id,
      },
    });

    expect(addresseeOnDatabase).toBeNull();
  });
});
