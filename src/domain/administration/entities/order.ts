import { Optional } from 'src/domain/core/utils';
import { Entity } from '../../core/entity';

type Status =
  | 'IN_ANALYSIS'
  | 'WAITING'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'RETURNED';

interface OrderProps {
  status: Status; // Value Object?
  conveyerId?: string;
  addresseeId: string;
  createdAt: Date;
  updatedAt?: Date;
  // createdBy?
}

export class Order extends Entity<OrderProps> {
  constructor(props: Optional<OrderProps, 'status'>) {
    super({ status: 'IN_ANALYSIS', ...props });
  }

  get status(): Status {
    return this.props.status;
  }

  ready() {
    if (this.props.status !== 'IN_ANALYSIS') {
      throw new Error('Order is not waiting to be picked up');
    }

    this.props.status = 'WAITING';
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

  public getDeliveredDate(): Date {
    if (this.props.status !== 'DELIVERED') {
      throw new Error('Order is not delivered yet');
    } else if (!this.props.updatedAt) {
      throw new Error('Order has no updated date');
    }

    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
