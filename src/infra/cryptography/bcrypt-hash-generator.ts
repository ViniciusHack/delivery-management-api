import { HashGenerator } from '@/domain/administration/cryptography/hashGenerator';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class BcryptHashGenerator implements HashGenerator {
  private SALT = 8;

  async hash(plainText: string) {
    const hashed = await hash(plainText, this.SALT);
    return hashed;
  }
}
