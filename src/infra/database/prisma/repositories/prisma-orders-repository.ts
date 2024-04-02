import { PaginationParams } from '@/core/utils';
import { Order } from '@/domain/administration/entities/order';
import {
  FindManyByShipperIdParams,
  OrdersRepository,
} from '@/domain/administration/repositories/orders-repository';
import { Injectable } from '@nestjs/common';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

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

  async create(order: Order) {
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPersistence(order),
    });
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
    await this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
