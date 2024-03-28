import { InvalidCpfError } from '@/domain/administration/entities/errors/invalid-cpf';

import { ConflictError } from '@/core/errors/conflict-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Role } from '@/core/permissions';
import { RegisterShipperUseCase } from '@/domain/administration/use-cases/register-shipper';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const registerShipperBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  password: z.string(),
});

type RegisterShipperBody = z.infer<typeof registerShipperBodySchema>;

const registerShipperValidator = new ZodValidationPipe(
  registerShipperBodySchema,
);

@Controller('/shippers')
export class RegisterShipperController {
  constructor(private registerShipperUseCase: RegisterShipperUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.Admin)
  async handle(
    @Body(registerShipperValidator) body: RegisterShipperBody,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.registerShipperUseCase.execute({
        adminId: user.sub,
        ...body,
      });
    } catch (err) {
      if (err instanceof InvalidCpfError) {
        throw new BadRequestException('Invalid CPF');
      } else if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      } else if (err instanceof ConflictError) {
        throw new ConflictException('Shipper already exists.');
      }
    }
  }
}
