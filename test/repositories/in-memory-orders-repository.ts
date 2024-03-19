import { PaginationParams } from '@/domain/core/utils';
import { Order } from 'src/domain/administration/entities/order';
import { OrdersRepository } from 'src/domain/administration/repositories/orders-repository';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string) {
    return this.items.find((order) => order.id === id) ?? null;
  }

  async findMany({ page, perPage }: PaginationParams): Promise<Order[]> {
    return this.items.slice((page - 1) * perPage, page * perPage);
  }

  async create(order: Order) {
    this.items.push(order);
  }

  async delete(id: string) {
    this.items = this.items.filter((order) => order.id !== id) ?? null;
  }
}
