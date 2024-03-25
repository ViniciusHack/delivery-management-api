import { HashGenerator } from '@/domain/administration/cryptography/hashGenerator';
import { Module } from '@nestjs/common';
import { BcryptHashGenerator } from './bcrypt-hash-generator';

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHashGenerator,
    },
  ],
  exports: [HashGenerator],
})
export class CryptographyModule {}
