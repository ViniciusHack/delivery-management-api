import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { InvalidCredentialsError } from '@/domain/administration/use-cases/errors/invalid-credentials';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const authenticateBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Public()
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody) {
    try {
      const { token } = await this.authenticateUseCase.execute(body);

      return {
        token,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new ForbiddenException('Invalid credentials');
      }
      throw new BadRequestException('Unexpected error');
    }
  }
}
