export abstract class HashGenerator {
  abstract hash(plainValue: string): Promise<string>;
}
