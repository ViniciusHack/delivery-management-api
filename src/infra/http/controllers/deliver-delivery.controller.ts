import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { Role } from '@/core/permissions';
import { DeliverDeliveryUseCase } from '@/domain/deliveries/use-cases/deliver-delivery';

import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const deliverDeliveryBodySchema = z.object({
  photoId: z.string().uuid(),
});

type DeliverDeliveryBody = z.infer<typeof deliverDeliveryBodySchema>;

const deliverDeliveryValidator = new ZodValidationPipe(
  deliverDeliveryBodySchema,
);

@Controller('/deliveries/:id/deliver')
export class DeliverDeliveryController {
  constructor(private deliverDeliveryUseCase: DeliverDeliveryUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(Role.Shipper)
  async handle(
    @Body(deliverDeliveryValidator) body: DeliverDeliveryBody,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.deliverDeliveryUseCase.execute({
        photoId: body.photoId,
        deliveryId: id,
        shipperId: user.sub,
      });
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      } else if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }
}
