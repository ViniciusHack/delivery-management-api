import { Encrypter } from '@/domain/administration/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(value: any) {
    return this.jwtService.sign(value);
  }
}
