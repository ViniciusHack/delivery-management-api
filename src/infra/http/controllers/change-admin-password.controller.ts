import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Role } from '@/core/permissions';
import { ChangeAdminPasswordUseCase } from '@/domain/administration/use-cases/change-admin-password';
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
  Patch,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const changeAdminPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

type ChangeAdminPasswordBody = z.infer<typeof changeAdminPasswordBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(changeAdminPasswordBodySchema);

@Controller('/admins/password')
export class ChangeAdminPasswordController {
  constructor(private changeAdminPasswordUseCase: ChangeAdminPasswordUseCase) {}

  @Patch()
  @HttpCode(200)
  @Roles(Role.Admin)
  async handle(
    @Body(bodyValidationPipe) body: ChangeAdminPasswordBody,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.changeAdminPasswordUseCase.execute({
        adminId: user.sub,
        ...body,
      });
    } catch (err) {
      console.log(err);
      if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException('Admin not found');
      } else if (err instanceof InvalidCredentialsError) {
        throw new ForbiddenException('Passwords do not match');
      }
    }
  }
}
