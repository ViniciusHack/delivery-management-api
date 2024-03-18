import { Encrypter } from '@/domain/administration/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(value: any): Promise<string> {
    return JSON.stringify(value);
  }
}
