import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';

import { DomainEvents } from '@/core/events/domain-events';
import { OrderFactory } from 'test/factories/makeOrder';
import { ShipperFactory } from 'test/factories/makeShipper';
import { EventsModule } from './events.module';

describe(`On delivery picked up (E2E)`, () => {
  let app: INestApplication;
  let shipperFactory: ShipperFactory;
  let orderFactory: OrderFactory;
  let addresseeFactory: AddresseeFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EventsModule],
      providers: [ShipperFactory, OrderFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    shipperFactory = moduleRef.get(ShipperFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwtService = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;
    await app.init();
  });

  it('should notify when a delivery is picked up', async () => {
    const shipper = await shipperFactory.makePrismaShipper();

    const token = jwtService.sign({
      sub: shipper.id,
      role: Role.Shipper,
    });

    const addressee = await addresseeFactory.makePrismaAddressee();

    const order = await orderFactory.makePrismaOrder({
      addresseeId: addressee.id,
      shipperId: shipper.id,
      stage: 'WAITING',
    });

    await request(app.getHttpServer())
      .patch(`/deliveries/${order.id}/pick-up`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    await vi.waitFor(
      async () => {
        const notificationOnDatabase = await prisma.notification.findMany({
          where: {
            recipientId: addressee.id,
          },
        });

        expect(notificationOnDatabase).toHaveLength(1);
        expect(notificationOnDatabase).toEqual([
          expect.objectContaining({
            title: 'Sua entrega está à caminho!',
          }),
        ]);
      },
      {
        timeout: 4000,
      },
    );
  });
});
