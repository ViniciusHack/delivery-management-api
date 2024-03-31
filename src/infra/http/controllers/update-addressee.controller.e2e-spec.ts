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

describe(`Update addressee (E2E)`, () => {
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

  test('[PUT] /addressees/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      id: 'admin-id',
      cpf: new Cpf('123.456.789-09'),
    });

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const addressee = await addresseeFactory.makePrismaAddressee({
      email: 'johndoe@test.com',
    });

    const response = await request(app.getHttpServer())
      .put(`/addressees/${addressee.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        city: 'Goiatins',
        street: 'Praça Aprígio Cavalcante, s/n',
        number: '70',
        neighborhood: 'Setor Central',
        state: 'TO',
        country: 'BR',
        zipCode: '77770-970',
      });

    console.log(response.body);
    expect(response.statusCode).toBe(200);

    const addresseeOnDatabase = await prisma.addressee.findUnique({
      where: {
        email: 'johndoe@test.com',
      },
    });

    expect(addresseeOnDatabase).toEqual(
      expect.objectContaining({
        city: 'Goiatins',
        zipCode: '77770-970',
      }),
    );
  });
});
