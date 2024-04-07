import { PaginationParams } from '@/core/utils';
import { Order } from '@/domain/administration/entities/order';
import {
  FindManyByShipperIdParams,
  OrdersRepository,
} from '@/domain/administration/repositories/orders-repository';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { Injectable } from '@nestjs/common';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService, private cache: CacheRepository) {}

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    return order ? PrismaOrderMapper.toDomain(order) : null;
  }

  async findMany({ page, perPage }: PaginationParams) {
    const orders = await this.prisma.order.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyByShipperId({
    page,
    perPage,
    shipperId,
  }: FindManyByShipperIdParams) {
    const orders = await this.prisma.order.findMany({
      where: {
        shipperId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyByAddresseeId(addresseeId: string) {
    const cacheHit = await this.cache.get(`${addresseeId}:orders`);
    if (cacheHit) {
      const orders: Order[] = JSON.parse(cacheHit);
      return orders;
    }

    const prismaOrders = await this.prisma.order.findMany({
      where: {
        addresseeId: addresseeId,
      },
    });

    const orders = prismaOrders.map((order) =>
      PrismaOrderMapper.toDomain(order),
    );

    await this.cache.set(`${addresseeId}:orders`, JSON.stringify(orders));
    return orders;
  }

  async create(order: Order) {
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPersistence(order),
    });
    await this.cache.delete(`${order.addresseeId}:orders`);
  }

  async update(order: Order) {
    await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: PrismaOrderMapper.toPersistence(order),
    });
  }

  async delete(id: string) {
    const order = await this.prisma.order.delete({
      select: {
        addresseeId: true,
      },
      where: {
        id,
      },
    });
    await this.cache.delete(`${order.addresseeId}:orders`);
  }
}
