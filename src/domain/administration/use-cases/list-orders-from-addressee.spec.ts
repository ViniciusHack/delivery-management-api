import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeAdmin } from 'test/factories/makeAdmin';
import { makeOrder } from 'test/factories/makeOrder';
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAddressee } from 'test/factories/makeAddressee';
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository';
import { ListOrdersFromAddresseeUseCase } from './list-orders-from-addressee';

let sut: ListOrdersFromAddresseeUseCase;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryAdminsRepository: InMemoryAdminsRepository;
let inMemoryAddresseesRepository: InMemoryAddresseesRepository;

describe('List orders from addressee', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryAdminsRepository = new InMemoryAdminsRepository();
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository();
    sut = new ListOrdersFromAddresseeUseCase(
      inMemoryOrdersRepository,
      inMemoryAdminsRepository,
      inMemoryAddresseesRepository,
    );
  });

  it(`should be able to list orders of an addressee when you're an admin`, async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const addressee1 = makeAddressee();
    const addressee2 = makeAddressee();

    await inMemoryAddresseesRepository.items.push(addressee1);
    await inMemoryAddresseesRepository.items.push(addressee2);

    const order1 = makeOrder({ addresseeId: addressee1.id });
    const order2 = makeOrder({ addresseeId: addressee1.id });
    const order3 = makeOrder({ addresseeId: addressee2.id });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);
    await inMemoryOrdersRepository.create(order3);

    const { orders } = await sut.execute({
      adminId: admin.id,
      addresseeId: addressee1.id,
    });

    expect(orders).toHaveLength(2);
    expect(orders).toEqual(
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

  it(`should not be able to list a shippers's deliveries with an inexistent adminId`, async () => {
    const addressee = makeAddressee();

    await inMemoryAddresseesRepository.items.push(addressee);

    const order = makeOrder({ addresseeId: addressee.id });

    await inMemoryOrdersRepository.create(order);
    expect(() =>
      sut.execute({
        adminId: 'invalid-admin-id',
        addresseeId: addressee.id,
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should not be able to list orders from a inexistent addressee', async () => {
    const admin = makeAdmin();

    await inMemoryAdminsRepository.create(admin);

    const addressee = makeAddressee();

    inMemoryAddresseesRepository.items.push(addressee);

    const order = makeOrder({ addresseeId: addressee.id });

    await inMemoryOrdersRepository.create(order);

    expect(() =>
      sut.execute({
        adminId: admin.id,
        addresseeId: 'inexistent-addressee-id',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
