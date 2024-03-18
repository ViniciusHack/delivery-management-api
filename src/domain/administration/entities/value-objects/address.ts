interface AddressProps {
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class Address {
  public readonly street: string;
  public readonly number: number;
  public readonly neighborhood: string;
  public readonly city: string;
  public readonly state: string;
  public readonly country: string;
  public readonly zipCode: string;

  constructor(props: AddressProps) {
    this.street = props.street;
    this.number = props.number;
    this.neighborhood = props.neighborhood;
    this.city = props.city;
    this.state = props.state;
    this.country = props.country;
    this.zipCode = props.zipCode;
  }

  isEqual(address: Address): boolean {
    return (
      this.street === address.street &&
      this.number === address.number &&
      this.neighborhood === address.neighborhood &&
      this.city === address.city &&
      this.state === address.state &&
      this.country === address.country &&
      this.zipCode === address.zipCode
    );
  }
}
