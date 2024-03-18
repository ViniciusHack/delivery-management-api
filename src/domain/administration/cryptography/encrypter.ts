export abstract class Encrypter {
  abstract encrypt(value: any): Promise<string>;
}
