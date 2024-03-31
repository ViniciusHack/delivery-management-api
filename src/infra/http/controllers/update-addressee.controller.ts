import { ConflictError } from '@/core/errors/conflict-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Role } from '@/core/permissions';

import { UpdateAddresseeUseCase } from '@/domain/administration/use-cases/update-addressee';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const updateAddresseeBodySchema = z.object({
  city: z.string(),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

type UpdateAddresseeBody = z.infer<typeof updateAddresseeBodySchema>;

const updateAddresseeValidator = new ZodValidationPipe(
  updateAddresseeBodySchema,
);

@Controller('/addressees/:id')
export class UpdateAddresseeController {
  constructor(private updateAddresseeUseCase: UpdateAddresseeUseCase) {}

  @Put()
  @HttpCode(200)
  @Roles(Role.Admin)
  async handle(
    @Body(updateAddresseeValidator) body: UpdateAddresseeBody,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.updateAddresseeUseCase.execute({
        adminId: user.sub,
        addresseeId: id,
        ...body,
      });
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      } else if (err instanceof ConflictError) {
        throw new ConflictException('Shipper already exists.');
      }
    }
  }
}
