import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { Role } from '@/core/permissions';
import { PickUpDeliveryUseCase } from '@/domain/deliveries/use-cases/pick-up-delivery';

import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Controller,
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
      console.log(err);
      if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }
}
