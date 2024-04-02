import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { Role } from '@/core/permissions';
import { ReleaseOrderForPickUpUseCase } from '@/domain/administration/use-cases/release-order-for-pick-up';

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

@Controller('/orders/:id')
export class ReleaseOrderForPickUpController {
  constructor(
    private releaseOrderForPickUpUseCase: ReleaseOrderForPickUpUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(Role.Admin)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    try {
      await this.releaseOrderForPickUpUseCase.execute({
        orderId: id,
        adminId: user.sub,
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
