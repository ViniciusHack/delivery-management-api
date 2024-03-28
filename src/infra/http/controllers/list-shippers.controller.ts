import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Role } from '@/core/permissions';

import { ListShippersUseCase } from '@/domain/administration/use-cases/list-shippers';
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
import { ShipperPresenter } from '../presenter/shipper-presenter';

const pageQueryValidationSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const perPageQueryValidationSchema = z
  .string()
  .optional()
  .default('20')
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryValidationSchema>;

const pageQueryValidationPipe = new ZodValidationPipe(
  pageQueryValidationSchema,
);

type PerPageQueryParamSchema = z.infer<typeof perPageQueryValidationSchema>;

const perPageQueryValidationPipe = new ZodValidationPipe(
  perPageQueryValidationSchema,
);

@Controller('/shippers')
export class ListShippersController {
  constructor(private listShipperUseCase: ListShippersUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles(Role.Admin)
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query('perPage', perPageQueryValidationPipe)
    perPage: PerPageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const { shippers } = await this.listShipperUseCase.execute({
        adminId: user.sub,
        page,
        perPage,
      });

      return {
        shippers: shippers.map((shipper) => ShipperPresenter.toHTTP(shipper)),
      };
    } catch (err) {
      if (err instanceof NotAllowedError) {
        throw new ForbiddenException('Not allowed.');
      }
    }
  }
}
