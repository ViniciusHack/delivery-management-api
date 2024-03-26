import { Encrypter } from '@/domain/administration/cryptography/encrypter';
import { JwtService } from '@nestjs/jwt';

export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(value: any) {
    return this.jwtService.sign(value);
  }
}
