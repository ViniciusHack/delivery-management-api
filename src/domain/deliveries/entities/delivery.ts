import { Entity } from '../../../core/entity';
import { DeliveryNotDeliverableError } from './errors/delivery-not-deliverable';
import { DeliveryAlreadyReturnedError } from './errors/delivery-not-returnable';
import { DeliveryNotWaitingPickUpError } from './errors/delivery-not-waiting-for-pick-up';

type Stage = 'WAITING' | 'ON_THE_WAY' | 'DELIVERED' | 'RETURNED';

interface DeliveryProps {
  stage: Stage; // Value Object?
  shipperId?: string;
  addresseeId: string;
  updatedAt?: Date;
}

export class Delivery extends Entity<DeliveryProps> {
  constructor(props: DeliveryProps, id?: string) {
    super(props, id);
  }

  get stage(): Stage {
    return this.props.stage;
  }

  deliver(): void {
    if (this.props.stage !== 'ON_THE_WAY') {
      throw new DeliveryNotDeliverableError();
    }

    this.props.stage = 'DELIVERED';
    this.touch();
  }

  return(): void {
    if (this.props.stage !== 'ON_THE_WAY') {
      throw new DeliveryAlreadyReturnedError();
    }

    this.props.stage = 'RETURNED';
    this.touch();
  }

  pickUp(shipperId: string): void {
    if (this.stage !== 'WAITING') {
      throw new DeliveryNotWaitingPickUpError();
    }

    this.props.stage = 'ON_THE_WAY';
    this.props.shipperId = shipperId;
    this.touch();
  }

  get shipperId(): string | undefined {
    return this.props.shipperId;
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
