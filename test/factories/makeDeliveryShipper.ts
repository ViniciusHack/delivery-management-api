import { Shipper } from '@/domain/deliveries/entities/shipper';

export function makeShipper(override?: Partial<Shipper>): Shipper {
  return new Shipper({
    ...override,
  });
}
