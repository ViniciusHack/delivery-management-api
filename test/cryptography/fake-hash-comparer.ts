import { HashComparer } from '@/domain/administration/cryptography/hashComparer';

export class FakeHashComparer implements HashComparer {
  async compare(value: string, hash: string): Promise<boolean> {
    return value === hash.replace('hashed:', '');
  }
}
