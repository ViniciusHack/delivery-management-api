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

describe(`Pick up delivery (E2E)`, () => {
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

  test('[PATCH] /deliveries/:id/pick-up', async () => {
    const shipper = await shipperFactory.makePrismaShipper();

    const token = jwtService.sign({
      sub: shipper.id,
      role: Role.Shipper,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    const order = await orderFactory.makePrismaOrder({
      addresseeId: addressee.id,
      stage: 'WAITING',
    });

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${order.id}/pick-up`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(204);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        addresseeId: addressee.id,
      },
    });
    expect(orderOnDatabase?.stage).toEqual('ON_THE_WAY');
  });
});
