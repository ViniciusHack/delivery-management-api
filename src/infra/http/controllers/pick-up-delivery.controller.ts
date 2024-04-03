import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { Role } from '@/core/permissions';
import { PickUpDeliveryUseCase } from '@/domain/deliveries/use-cases/pick-up-delivery';

import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';

@Controller('/deliveries/:id/pick-up')
export class PickUpDeliveryController {
  constructor(private pickUpDeliveryUseCase: PickUpDeliveryUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(Role.Shipper)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    try {
      await this.pickUpDeliveryUseCase.execute({
        deliveryId: id,
        shipperId: user.sub,
      });
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      } else if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException('Order not found.');
      }
    }
  }
}
