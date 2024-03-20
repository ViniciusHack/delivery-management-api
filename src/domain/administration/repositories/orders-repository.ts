import { PaginationParams } from '@/core/utils';
import { Order } from '../entities/order';

export type FindManyByShipperIdParams = PaginationParams & {
  shipperId: string;
};

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findMany(params: PaginationParams): Promise<Order[]>;
  abstract findManyByShipperId(
    params: FindManyByShipperIdParams,
  ): Promise<Order[]>;
  abstract create(order: Order): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
