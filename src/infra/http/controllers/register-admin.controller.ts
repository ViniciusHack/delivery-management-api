import { ConflictError } from '@/core/errors/conflict-error';
import { InvalidCpfError } from '@/domain/administration/entities/errors/invalid-cpf';
import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const registerAdminBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  password: z.string(),
});

type RegisterAdminBody = z.infer<typeof registerAdminBodySchema>;

@Public()
@Controller('/admins')
export class RegisterAdminController {
  constructor(private registerAdminUseCase: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerAdminBodySchema))
  async handle(@Body() body: RegisterAdminBody) {
    try {
      await this.registerAdminUseCase.execute(body);
    } catch (err) {
      if (err instanceof InvalidCpfError) {
        throw new BadRequestException('Invalid CPF');
      } else if (err instanceof ConflictError) {
        throw new ConflictException('Admin already exists');
      }
    }
  }
}
