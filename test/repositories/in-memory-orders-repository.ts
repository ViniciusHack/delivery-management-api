import { PaginationParams } from '@/core/utils';
import { Order } from 'src/domain/administration/entities/order';
import {
  FindManyByShipperIdParams,
  OrdersRepository,
} from 'src/domain/administration/repositories/orders-repository';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string) {
    return this.items.find((order) => order.id === id) ?? null;
  }

  async findManyByAddresseeId(addresseeId: string) {
    return this.items.filter((order) => order.addresseeId === addresseeId);
  }

  async findMany({ page, perPage }: PaginationParams): Promise<Order[]> {
    return this.items.slice((page - 1) * perPage, page * perPage);
  }

  async findManyByShipperId({
    shipperId,
    page,
    perPage,
  }: FindManyByShipperIdParams): Promise<Order[]> {
    return this.items
      .filter((order) => order.shipperId === shipperId)
      .slice((page - 1) * perPage, page * perPage);
  }

  async create(order: Order) {
    this.items.push(order);
  }

  async update(order: Order) {
    const index = this.items.findIndex((o) => o.id === order.id);
    this.items[index] = order;
  }

  async delete(id: string) {
    this.items = this.items.filter((order) => order.id !== id) ?? null;
  }
}
