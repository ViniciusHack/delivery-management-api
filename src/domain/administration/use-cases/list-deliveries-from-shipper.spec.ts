import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeOrder } from 'test/factories/makeOrder';
import { makeShipper } from 'test/factories/makeShipper';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryShippersRepository } from 'test/repositories/in-memory-shippers-repository';
import { ListDeliveriesFromShipperUseCase } from './list-deliveries-from-shipper';

let sut: ListDeliveriesFromShipperUseCase;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let inMemoryShippersRepository: InMemoryShippersRepository;

describe('List deliveries from shipper', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryShippersRepository = new InMemoryShippersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    sut = new ListDeliveriesFromShipperUseCase(
      inMemoryOrdersRepository,
      inMemoryAdminsRepository,
    );
  });

  it(`should be able to list a shippers's deliveries when you're an admin`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    const order = makeOrder({ shipperId: shipper1.id });

    await inMemoryOrdersRepository.create(order);

    const { deliveries } = await sut.execute({
      adminId: admin.id,
      targetShipperId: shipper1.id,
      requestingShipperId: 'it-should-not-matter',
    });
    expect(deliveries).toEqual([expect.objectContaining(order)]);
  });

  it(`should be able to list a shippers's deliveries when you're the responsible`, async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    const order = makeOrder({ shipperId: shipper1.id });

    await inMemoryOrdersRepository.create(order);

    const { deliveries } = await sut.execute({
      targetShipperId: shipper1.id,
      requestingShipperId: shipper1.id,
    });
    expect(deliveries).toEqual([expect.objectContaining(order)]);
  });

  it(`should not be able to list a shippers's deliveries with an inexistent adminId`, async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    const order = makeOrder({ shipperId: shipper1.id });

    await inMemoryOrdersRepository.create(order);
    expect(() =>
      sut.execute({
        adminId: 'invalid-admin-id',
        targetShipperId: shipper1.id,
        requestingShipperId: 'it-should-not-matter',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it(`should not be able to list a shippers's deliveries when you aren't the responsible`, async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    const order = makeOrder({ shipperId: shipper2.id });

    await inMemoryOrdersRepository.create(order);

    expect(() =>
      sut.execute({
        targetShipperId: shipper2.id,
        requestingShipperId: shipper1.id,
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should be able to list a shippers deliveries with pagination', async () => {
    const shipper1 = makeShipper();
    const shipper2 = makeShipper();

    await inMemoryShippersRepository.create(shipper1);
    await inMemoryShippersRepository.create(shipper2);

    const order1 = makeOrder({ shipperId: shipper1.id });
    const order2 = makeOrder({ shipperId: shipper1.id });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);

    const { deliveries } = await sut.execute({
      targetShipperId: shipper1.id,
      requestingShipperId: shipper1.id,
      page: 2,
      perPage: 1,
    });

    expect(deliveries).toEqual([expect.objectContaining(order2)]);
  });
});
