import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';
import { AdminFactory } from 'test/factories/makeAdmin';

describe(`Register order (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let addresseeFactory: AddresseeFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;

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

  test('[POST] /orders', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        addresseeId: addressee.id,
      });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        addresseeId: addressee.id,
      },
    });

    expect(orderOnDatabase).not.toBeNull();
  });
});
