import { Shipper } from '@/domain/deliveries/entities/shipper';
import { Cpf } from '@/domain/deliveries/entities/value-objects/cpf';

export function makeShipper(override?: Partial<Shipper>): Shipper {
  return new Shipper({
    cpf: new Cpf('12345678909'),
    ...override,
  });
}
