import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Role } from '@/core/permissions';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteAddresseeUseCase } from '@/domain/administration/use-cases/delete-addressee';
import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

@Controller('/addressees/:id')
export class DeleteAddresseeController {
  constructor(private deleteAddresseeUseCase: DeleteAddresseeUseCase) {}

  @Delete()
  @HttpCode(200)
  @Roles(Role.Admin)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    try {
      await this.deleteAddresseeUseCase.execute({
        adminId: user.sub,
        addresseeId: id,
      });
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      } else if (err instanceof ResourceNotFoundError) {
        throw new NotFoundException('Addressee not found');
      }
    }
  }
}
