import { Entity } from '../../core/entity';

type Stage = 'WAITING' | 'ON_THE_WAY' | 'DELIVERED' | 'RETURNED';

interface OrderProps {
  stage: Stage; // Value Object?
  conveyerId?: string;
  addresseeId: string;
  updatedAt?: Date;
  // createdBy?
}

export class Order extends Entity<OrderProps> {
  constructor(props: OrderProps, id: string) {
    super(props, id);
  }

  get stage(): Stage {
    return this.props.stage;
  }

  deliver(): void {
    if (this.props.stage !== 'ON_THE_WAY') {
      throw new Error('Order is not on the way to be delivered');
    }

    this.props.stage = 'DELIVERED';
    this.touch();
  }

  return(): void {
    if (this.props.stage === 'RETURNED') {
      throw new Error('Order is already returned');
    }

    this.props.stage = 'RETURNED';
    this.touch();
  }

  pickUp(conveyerId: string): void {
    if (this.stage !== 'WAITING') {
      throw new Error('Order is not waiting to be picked up');
    }

    this.props.stage = 'ON_THE_WAY';
    this.props.conveyerId = conveyerId;
    this.touch();
  }

  get conveyerId(): string | undefined {
    return this.props.conveyerId;
  }

  get addresseeId(): string {
    return this.props.addresseeId;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
