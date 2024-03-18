import { HashGenerator } from '@/domain/administration/cryptography/hashGenerator';

export class FakeHashGenerator implements HashGenerator {
  async hash(value: string): Promise<string> {
    return `hashed:${value}`;
  }
}
