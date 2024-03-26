import { HashComparer } from '@/domain/administration/cryptography/hashComparer';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';

@Injectable()
export class BcryptHashComparer implements HashComparer {
  async compare(plainText: string, hashedText: string) {
    const hashed = await compare(plainText, hashedText);
    return hashed;
  }
}
