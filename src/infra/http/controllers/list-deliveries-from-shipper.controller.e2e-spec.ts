import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';
import { OrderFactory } from 'test/factories/makeOrder';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`List deliveries from shipper (E2E)`, () => {
  let app: INestApplication;
  let shipperFactory: ShipperFactory;
  let orderFactory: OrderFactory;
  let addresseeFactory: AddresseeFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ShipperFactory, OrderFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    shipperFactory = moduleRef.get(ShipperFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /shippers/:id/deliveries', async () => {
    const shipper = await shipperFactory.makePrismaShipper();

    const token = jwtService.sign({
      sub: shipper.id,
      role: Role.Shipper,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    await Promise.all([
      orderFactory.makePrismaOrder({
        addresseeId: addressee.id,
        shipperId: shipper.id,
      }),
      orderFactory.makePrismaOrder({
        addresseeId: addressee.id,
        shipperId: shipper.id,
      }),
    ]);

    const order3 = await orderFactory.makePrismaOrder({
      addresseeId: addressee.id,
      shipperId: shipper.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/shippers/${shipper.id}/deliveries?perPage=2&page=2`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);

    expect(response.body.deliveries).length(1);
    expect(response.body.deliveries).toEqual([
      expect.objectContaining({
        id: order3.id,
      }),
    ]);
  });
});
