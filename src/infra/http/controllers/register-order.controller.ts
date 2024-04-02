import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Role } from '@/core/permissions';
import { RegisterOrderUseCase } from '@/domain/administration/use-cases/register-order';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const registerOrderBodySchema = z.object({
  addresseeId: z.string().uuid(),
});

type RegisterOrderBody = z.infer<typeof registerOrderBodySchema>;

const registerOrderValidator = new ZodValidationPipe(registerOrderBodySchema);

@Controller('/orders')
export class RegisterOrderController {
  constructor(private registerOrderUseCase: RegisterOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.Admin)
  async handle(
    @Body(registerOrderValidator) body: RegisterOrderBody,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.registerOrderUseCase.execute({
        adminId: user.sub,
        ...body,
      });
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      } else if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException('Order not exists.');
      }
    }
  }
}
