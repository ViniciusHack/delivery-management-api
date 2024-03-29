import { Entity } from '../../../core/entity';
import { Address } from './value-objects/address';

interface AddresseeProps {
  address: Address;
  email: string;
}

export class Addressee extends Entity<AddresseeProps> {
  constructor(props: AddresseeProps, id?: string) {
    super(props, id);
  }

  get address(): Address {
    return this.props.address;
  }

  set address(address: Address) {
    this.props.address = address;
  }

  get email(): string {
    return this.props.email;
  }
}
