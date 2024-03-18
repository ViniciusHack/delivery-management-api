import { Conveyer } from '../entities/conveyer';
import { Cpf } from '../entities/value-objects/cpf';

export abstract class ConveyersRepository {
  abstract findByCpf(cpf: Cpf): Promise<Conveyer | null>;
}
