import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';
import { AdminFactory } from 'test/factories/makeAdmin';
import { OrderFactory } from 'test/factories/makeOrder';

describe(`List orders from addressee (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let orderFactory: OrderFactory;
  let addresseeFactory: AddresseeFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, OrderFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /addressees/:id/orders', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    const [order1, order2] = await Promise.all([
      orderFactory.makePrismaOrder({
        addresseeId: addressee.id,
      }),
      orderFactory.makePrismaOrder({
        addresseeId: addressee.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/addressees/${addressee.id}/orders`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);

    expect(response.body.orders).length(2);
    expect(response.body.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order1.id,
        }),
        expect.objectContaining({
          id: order2.id,
        }),
      ]),
    );
  });
});
