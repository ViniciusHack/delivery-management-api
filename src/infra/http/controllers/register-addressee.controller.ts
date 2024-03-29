import { InvalidCpfError } from '@/domain/administration/entities/errors/invalid-cpf';

import { ConflictError } from '@/core/errors/conflict-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Role } from '@/core/permissions';

import { RegisterAddresseeUseCase } from '@/domain/administration/use-cases/register-addressee';
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

const registerAddresseeBodySchema = z.object({
  email: z.string().email(),
  city: z.string(),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

type RegisterAddresseeBody = z.infer<typeof registerAddresseeBodySchema>;

const registerAddresseeValidator = new ZodValidationPipe(
  registerAddresseeBodySchema,
);

@Controller('/addressees')
export class RegisterAddresseeController {
  constructor(private registerAddresseeUseCase: RegisterAddresseeUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.Admin)
  async handle(
    @Body(registerAddresseeValidator) body: RegisterAddresseeBody,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.registerAddresseeUseCase.execute({
        adminId: user.sub,
        ...body,
      });
    } catch (err) {
      console.log(err);
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
