import { Entity } from '../../core/entity';

type Status = 'WAITING' | 'ON_THE_WAY' | 'DELIVERED' | 'RETURNED';

interface OrderProps {
  status: Status; // Value Object?
  conveyerId?: string;
  addresseeId: string;
  createdAt: Date;
  updatedAt?: Date;
  // createdBy?
}

export class Order extends Entity<OrderProps> {
  constructor(props: OrderProps, id: string) {
    super(props, id);
  }

  get status(): Status {
    return this.props.status;
  }

  deliver(): void {
    if (this.props.status !== 'ON_THE_WAY') {
      throw new Error('Order is not on the way to be delivered');
    }

    this.props.status = 'DELIVERED';
    this.touch();
  }

  return(): void {
    if (this.props.status === 'RETURNED') {
      throw new Error('Order is already returned');
    }

    this.props.status = 'RETURNED';
    this.touch();
  }

  pickUp(conveyerId: string): void {
    if (this.status !== 'WAITING') {
      throw new Error('Order is not waiting to be picked up');
    }

    this.props.status = 'ON_THE_WAY';
    this.props.conveyerId = conveyerId;
    this.touch();
  }

  get conveyerId(): string | undefined {
    return this.props.conveyerId;
  }

  get addresseeId(): string {
    return this.props.addresseeId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
