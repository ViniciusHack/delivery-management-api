import { NotAllowedError } from '@/core/errors/not-allowed-error';

import { GetOrderUseCase } from '@/domain/administration/use-cases/get-order';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import { OrderPresenter } from '../presenter/order-presenter';

@Controller('/orders/:id')
export class GetOrderController {
  constructor(private getOrderUseCase: GetOrderUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    try {
      const { order } = await this.getOrderUseCase.execute({
        orderId: id,
      });

      return { order: OrderPresenter.toHTTP(order) };
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      }
    }
  }
}
