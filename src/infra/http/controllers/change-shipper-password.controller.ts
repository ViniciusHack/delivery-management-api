import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Role } from '@/core/permissions';
import { ChangeShipperPasswordUseCase } from '@/domain/administration/use-cases/change-shipper-password';
import { InvalidCredentialsError } from '@/domain/administration/use-cases/errors/invalid-credentials';
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

const changeShipperPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

type ChangeShipperPasswordBody = z.infer<
  typeof changeShipperPasswordBodySchema
>;

const bodyValidationPipe = new ZodValidationPipe(
  changeShipperPasswordBodySchema,
);

@Controller('/shippers/:id')
export class ChangeShipperPasswordController {
  constructor(
    private changeShipperPasswordUseCase: ChangeShipperPasswordUseCase,
  ) {}

  @Patch('/password')
  @HttpCode(200)
  @Roles(Role.Admin)
  async handle(
    @Body(bodyValidationPipe) body: ChangeShipperPasswordBody,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    try {
      await this.changeShipperPasswordUseCase.execute({
        adminId: user.sub,
        shipperId: id,
        ...body,
      });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException('Admin not found');
      } else if (err instanceof InvalidCredentialsError) {
        throw new ForbiddenException('Passwords do not match');
      } else if (err instanceof NotAllowedError) {
        throw new ForbiddenException();
      }
    }
  }
}
