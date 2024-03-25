import { RegisterAdminUseCase } from '@/domain/administration/use-cases/register-admin';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const registerAdminBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  password: z.string(),
});

type RegisterAdminBody = z.infer<typeof registerAdminBodySchema>;

@Controller('/admins')
export class RegisterAdminController {
  constructor(private registerAdminUseCase: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerAdminBodySchema))
  async handle(@Body() body: RegisterAdminBody) {
    await this.registerAdminUseCase.execute(body);
  }
}
