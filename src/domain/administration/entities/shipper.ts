import { Optional } from '@/core/utils';
import { Entity } from '../../../core/entity';
import { Cpf } from './value-objects/cpf';

interface ShipperProps {
  cpf: Cpf;
  password: string;
  createdAt: Date;
}

export class Shipper extends Entity<ShipperProps> {
  constructor(props: Optional<ShipperProps, 'createdAt'>, id?: string) {
    super({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }

  get cpf(): Cpf {
    return this.props.cpf;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    // validate if password is strong enough
    this.props.password = password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
