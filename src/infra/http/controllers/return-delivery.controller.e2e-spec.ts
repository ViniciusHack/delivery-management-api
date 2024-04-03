import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';

import { OrderFactory } from 'test/factories/makeOrder';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`Return delivery (E2E)`, () => {
  let app: INestApplication;
  let shipperFactory: ShipperFactory;
  let orderFactory: OrderFactory;
  let addresseeFactory: AddresseeFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ShipperFactory, OrderFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    shipperFactory = moduleRef.get(ShipperFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /deliveries/:id/return', async () => {
    const shipper = await shipperFactory.makePrismaShipper();

    const token = jwtService.sign({
      sub: shipper.id,
      role: Role.Shipper,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    const order = await orderFactory.makePrismaOrder({
      addresseeId: addressee.id,
      shipperId: shipper.id,
      stage: 'ON_THE_WAY',
    });

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${order.id}/return`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(204);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        addresseeId: addressee.id,
      },
    });
    expect(orderOnDatabase?.stage).toEqual('RETURNED');
  });
});
