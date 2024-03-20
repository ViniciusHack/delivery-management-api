import { Entity } from '../../../core/entity';
import { Address } from './value-objects/address';

interface AddresseeProps {
  address: Address;
}

export class Addressee extends Entity<AddresseeProps> {
  constructor(props: AddresseeProps) {
    super(props);
  }

  get address(): Address {
    return this.props.address;
  }

  set address(address: Address) {
    this.props.address = address;
  }
}
