import { NotAllowedError } from '@/core/errors/not-allowed-error';

import { Role } from '@/core/permissions';

import { ListOrdersFromAddresseeUseCase } from '@/domain/administration/use-cases/list-orders-from-addressee';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import { OrderPresenter } from '../presenter/order-presenter';

@Controller('/addressees/:id/orders')
export class ListOrdersFromAddresseeController {
  constructor(
    private listOrdersFromAddressee: ListOrdersFromAddresseeUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles(Role.Admin)
  async handle(
    @Param('id')
    addresseeId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const { orders } = await this.listOrdersFromAddressee.execute({
        adminId: user.sub,
        addresseeId,
      });

      return {
        orders: orders.map((delivery) => OrderPresenter.toHTTP(delivery)),
      };
    } catch (err) {
      console.log(err);
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      }
    }
  }
}
