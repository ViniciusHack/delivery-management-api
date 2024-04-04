import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { Address } from '@/domain/deliveries/entities/value-objects/address';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddresseeFactory } from 'test/factories/makeAddressee';
import { OrderFactory } from 'test/factories/makeOrder';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`List deliveries nearby (E2E)`, () => {
  let app: INestApplication;
  let orderFactory: OrderFactory;
  let shipperFactory: ShipperFactory;
  let addresseeFactory: AddresseeFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, ShipperFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    orderFactory = moduleRef.get(OrderFactory);
    shipperFactory = moduleRef.get(ShipperFactory);
    addresseeFactory = moduleRef.get(AddresseeFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /deliveries/nearby', async () => {
    const shipper = await shipperFactory.makePrismaShipper();

    const token = jwtService.sign({
      sub: shipper.id,
      role: Role.Shipper,
    });

    const [addresseeFar, addresseeNear] = await Promise.all([
      addresseeFactory.makePrismaAddressee({
        address: new Address({
          city: 'São Paulo',
          country: 'Brazil',
          latitude: -53.9859021,
          longitude: -23.1437386,
          neighborhood: 'John hood',
          number: '070',
          state: 'John state',
          street: 'John street',
          zipCode: '302554912',
        }),
      }),
      addresseeFactory.makePrismaAddressee({
        address: new Address({
          city: 'São Paulo',
          country: 'Brazil',
          latitude: -48.9859021,
          longitude: -21.1437386,
          neighborhood: 'John hood',
          number: '070',
          state: 'John state',
          street: 'John street',
          zipCode: '302554912',
        }),
      }),
    ]);

    const orderFar = await orderFactory.makePrismaOrder({
      addresseeId: addresseeFar.id,
      shipperId: shipper.id,
      stage: 'ON_THE_WAY',
    });

    const orderNear = await orderFactory.makePrismaOrder({
      addresseeId: addresseeNear.id,
      shipperId: shipper.id,
      stage: 'ON_THE_WAY',
    });

    const shipperCurrentCoordinates = {
      latitude: -48.985,
      longitude: -21.148,
    };

    const response = await request(app.getHttpServer())
      .get(
        `/deliveries/nearby?latitude=${shipperCurrentCoordinates.latitude}&longitude=${shipperCurrentCoordinates.longitude}`,
      )
      .set('Authorization', `Bearer ${token}`)
      .send();

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.deliveries).toHaveLength(1);
    expect(response.body.deliveries).toEqual([
      expect.objectContaining({
        id: orderNear.id,
      }),
    ]);
  });
});
