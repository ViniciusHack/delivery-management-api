import { Entity } from '../../../core/entity';
import { Cpf } from './value-objects/cpf';

interface AdminProps {
  cpf: Cpf;
  password: string;
}

export class Admin extends Entity<AdminProps> {
  constructor(props: AdminProps) {
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
