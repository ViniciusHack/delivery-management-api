import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Role } from '@/core/permissions';

import { ListDeliveriesNearbyUseCase } from '@/domain/deliveries/use-cases/list-deliveries-nearby';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { DeliveryPresenter } from '../presenter/delivery-presenter';

const coordinateParamSchema = z.coerce.number().max(90).min(-90);

type CoordinateParam = z.infer<typeof coordinateParamSchema>;

const coordinateParamValidator = new ZodValidationPipe(coordinateParamSchema);

@Controller('/deliveries/nearby')
export class ListDeliveriesNearbyController {
  constructor(private listDeliveryNearbyUseCase: ListDeliveriesNearbyUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles(Role.Shipper)
  async handle(
    @Query('latitude', coordinateParamValidator) latitude: CoordinateParam,
    @Query('longitude', coordinateParamValidator) longitude: CoordinateParam,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const { deliveries } = await this.listDeliveryNearbyUseCase.execute({
        shipperId: user.sub,
        shipperLatitude: latitude,
        shipperLongitude: longitude,
      });
      console.log({ deliveries });

      return {
        deliveries: deliveries.map((delivery) =>
          DeliveryPresenter.toHTTP(delivery),
        ),
      };
    } catch (err) {
      console.log(err);
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      }
    }
  }
}
