import { PaginationParams } from '@/domain/core/utils';
import { Order } from '../entities/order';

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findMany(params: PaginationParams): Promise<Order[]>;
  abstract create(order: Order): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
