import { Encrypter } from '@/domain/administration/cryptography/encrypter';
import { HashComparer } from '@/domain/administration/cryptography/hashComparer';
import { HashGenerator } from '@/domain/administration/cryptography/hashGenerator';
import { Module } from '@nestjs/common';
import { BcryptHashComparer } from './bcrypt-hash-comparer';
import { BcryptHashGenerator } from './bcrypt-hash-generator';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHashGenerator,
    },
    {
      provide: HashComparer,
      useClass: BcryptHashComparer,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [HashGenerator, HashComparer, Encrypter],
})
export class CryptographyModule {}
