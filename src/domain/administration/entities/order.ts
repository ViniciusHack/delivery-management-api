import { Optional } from 'src/domain/core/utils';
import { Entity } from '../../core/entity';
import { OrderNotDeliveredError } from './errors/order-not-devlivered';
import { OrderNotWaitingToBePickedUpError } from './errors/order-not-waiting-to-be-picked-up';

type Stage =
  | 'IN_ANALYSIS'
  | 'WAITING'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'RETURNED';

interface OrderProps {
  stage: Stage; // Value Object?
  conveyerId?: string;
  addresseeId: string;
  createdAt: Date;
  updatedAt?: Date;
  // createdBy?
}

export class Order extends Entity<OrderProps> {
  constructor(props: Optional<OrderProps, 'stage' | 'createdAt'>) {
    super({ stage: 'IN_ANALYSIS', createdAt: new Date(), ...props });
  }

  get stage(): Stage {
    return this.props.stage;
  }

  ready() {
    if (this.props.stage !== 'IN_ANALYSIS' && this.props.stage !== 'RETURNED') {
      throw new OrderNotWaitingToBePickedUpError();
    }

    this.props.stage = 'WAITING';
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
    if (this.props.stage !== 'DELIVERED') {
      throw new OrderNotDeliveredError();
    } else if (!this.props.updatedAt) {
      throw new Error('Order has no updated date');
    }

    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
