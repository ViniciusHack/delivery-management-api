import { Entity } from '../../core/entity';
import { Cpf } from './value-objects/cpf';

interface ConveyerProps {
  cpf: Cpf;
  password: string;
}

export class Conveyer extends Entity<ConveyerProps> {
  constructor(props: ConveyerProps) {
    super(props);
  }

  get cpf(): Cpf {
    return this.props.cpf;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }
}
