import { AppModule } from '@/app.module';
import { OrdersRepository } from '@/domain/administration/repositories/orders-repository';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AddresseeFactory } from 'test/factories/makeAddressee';
import { AdminFactory } from 'test/factories/makeAdmin';
import { OrderFactory, makeOrder } from 'test/factories/makeOrder';

describe(`Prisman orders Repository (E2E)`, () => {
  let app: INestApplication;
  let orderFactory: OrderFactory;
  let addresseeFactory: AddresseeFactory;
  let ordersRepository: OrdersRepository;
  let cacheRepository: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [AdminFactory, OrderFactory, AddresseeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    addresseeFactory = moduleRef.get(AddresseeFactory);
    orderFactory = moduleRef.get(OrderFactory);
    ordersRepository = moduleRef.get(OrdersRepository);
    cacheRepository = moduleRef.get(CacheRepository);

    await app.init();
  });

  it('it should be able to cache orders from an addressee', async () => {
    const addressee = await addresseeFactory.makePrismaAddressee();

    await Promise.all([
      orderFactory.makePrismaOrder({
        addresseeId: addressee.id,
      }),
      orderFactory.makePrismaOrder({
        addresseeId: addressee.id,
      }),
    ]);

    const ordersOnDatabase = await ordersRepository.findManyByAddresseeId(
      addressee.id,
    );

    const cachedOrders = await cacheRepository.get(`${addressee.id}:orders`);
    expect(cachedOrders).toEqual(JSON.stringify(ordersOnDatabase));
  });

  it('it should be able to get orders from an addressee from cache in subsequent calls', async () => {
    const addressee = await addresseeFactory.makePrismaAddressee();

    const order1 = makeOrder({
      addresseeId: addressee.id,
    });

    const order2 = makeOrder({
      addresseeId: addressee.id,
    });

    await cacheRepository.set(
      `${addressee.id}:orders`,
      JSON.stringify([order1, order2]),
    );
    const orders = await ordersRepository.findManyByAddresseeId(addressee.id);

    expect(JSON.stringify(orders)).toEqual(JSON.stringify([order1, order2]));
  });

  it('it should be able to delete cache of orders from an addressee when an order from the addressee is deleted', async () => {
    const addressee = await addresseeFactory.makePrismaAddressee();
    const addressee2 = await addresseeFactory.makePrismaAddressee();

    const order1 = await orderFactory.makePrismaOrder({
      addresseeId: addressee.id,
    });

    const order2 = await orderFactory.makePrismaOrder({
      addresseeId: addressee2.id,
    });

    await cacheRepository.set(
      `${addressee.id}:orders`,
      JSON.stringify([order1]),
    );
    await ordersRepository.delete(order2.id);

    let addressee1Cache = await cacheRepository.get(`${addressee.id}:orders`);
    expect(addressee1Cache).not.toBeNull();

    await ordersRepository.delete(order1.id);

    addressee1Cache = await cacheRepository.get(`${addressee.id}:orders`);
    expect(addressee1Cache).toBeNull();
  });

  it('it should be able to delete cache of orders from an addressee when a new order fort the addressee is created', async () => {
    const addressee = await addresseeFactory.makePrismaAddressee();
    const addressee2 = await addresseeFactory.makePrismaAddressee();

    const order1 = await orderFactory.makePrismaOrder({
      addresseeId: addressee.id,
    });

    await cacheRepository.set(
      `${addressee.id}:orders`,
      JSON.stringify([order1]),
    );

    const newOrderFromAnotherAddressee = makeOrder({
      addresseeId: addressee2.id,
    });

    await ordersRepository.create(newOrderFromAnotherAddressee);

    let addressee1Cache = await cacheRepository.get(`${addressee.id}:orders`);
    expect(addressee1Cache).not.toBeNull();

    const newOrder = makeOrder({
      addresseeId: addressee.id,
    });
    await ordersRepository.create(newOrder);

    addressee1Cache = await cacheRepository.get(`${addressee.id}:orders`);
    expect(addressee1Cache).toBeNull();
  });
});
