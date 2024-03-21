import { Entity } from '../../../core/entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShipperProps {}

export class Shipper extends Entity<ShipperProps> {
  constructor(props: ShipperProps, id?: string) {
    super(props, id);
  }
}
