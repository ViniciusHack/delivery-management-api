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
import { PhotoFactory } from 'test/factories/makePhoto';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`Deliver delivery (E2E)`, () => {
  let app: INestApplication;
  let shipperFactory: ShipperFactory;
  let orderFactory: OrderFactory;
  let addresseeFactory: AddresseeFactory;
  let photoFactory: PhotoFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ShipperFactory, OrderFactory, AddresseeFactory, PhotoFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    shipperFactory = moduleRef.get(ShipperFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    photoFactory = moduleRef.get(PhotoFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /deliveries/:id/deliver', async () => {
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

    const photo = await photoFactory.makePrismaPhoto();

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${order.id}/deliver`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        photoId: photo.id,
      });

    expect(response.status).toBe(204);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        addresseeId: addressee.id,
      },
    });

    expect(orderOnDatabase?.stage).toEqual('DELIVERED');
    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        stage: 'DELIVERED',
        updatedAt: expect.any(Date),
      }),
    );

    const photoOnDatabase = await prisma.photo.findUnique({
      where: {
        id: photo.id,
      },
    });

    expect(photoOnDatabase).toEqual(
      expect.objectContaining({
        deliveryId: order.id,
        updatedAt: expect.any(Date),
      }),
    );
  });
});
