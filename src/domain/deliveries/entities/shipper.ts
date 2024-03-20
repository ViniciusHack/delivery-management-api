import { Optional } from '@/core/utils';
import { Entity } from '../../../core/entity';
import { Cpf } from './value-objects/cpf';

interface ShipperProps {
  cpf: Cpf;
  createdAt: Date;
}

export class Shipper extends Entity<ShipperProps> {
  constructor(props: Optional<ShipperProps, 'createdAt'>, id?: string) {
    super({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }

  get cpf(): Cpf {
    return this.props.cpf;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
