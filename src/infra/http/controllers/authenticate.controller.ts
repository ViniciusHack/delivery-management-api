import { AuthenticateUseCase } from '@/domain/administration/use-cases/authenticate';
import { InvalidCredentialsError } from '@/domain/administration/use-cases/errors/invalid-credentials';
import {
  BadRequestException,
  Body,
  Controller,
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

@Controller('/sessions')
export class Authenticate {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody) {
    try {
      await this.authenticateUseCase.execute(body);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new BadRequestException('Invalid credentials');
      }
      throw new BadRequestException('Invalid credentials');
    }
  }
}
