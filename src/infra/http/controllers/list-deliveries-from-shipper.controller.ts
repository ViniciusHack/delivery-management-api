import { NotAllowedError } from '@/core/errors/not-allowed-error';

import { Role } from '@/core/permissions';
import {
  PageQueryParamSchema,
  PerPageQueryParamSchema,
  pageQueryValidationPipe,
  perPageQueryValidationPipe,
} from '@/core/utils';
import { ListDeliveriesFromShipperUseCase } from '@/domain/administration/use-cases/list-deliveries-from-shipper';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { OrderPresenter } from '../presenter/order-presenter';

@Controller('/shippers/:id/deliveries')
export class ListDeliveriesFromShipperController {
  constructor(private listShipperUseCase: ListDeliveriesFromShipperUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query('perPage', perPageQueryValidationPipe)
    perPage: PerPageQueryParamSchema,
    @Param('id')
    shipperId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const { deliveries } = await this.listShipperUseCase.execute({
        page,
        perPage,
        adminId: user.role === Role.Admin ? user.sub : undefined,
        requestingShipperId: user.role === Role.Shipper ? user.sub : undefined,
        targetShipperId: shipperId,
      });

      return {
        deliveries: deliveries.map((delivery) =>
          OrderPresenter.toHTTP(delivery),
        ),
      };
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      }
    }
  }
}
