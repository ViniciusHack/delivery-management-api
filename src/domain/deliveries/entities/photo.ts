import { Optional } from '@/core/utils';
import { Entity } from '../../../core/entity';
import { PhotoAlreadyConfirmedError } from './errors/photo-already-confirmed';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PhotoProps {
  deliveryId?: string;
  link: string;
}

export class Photo extends Entity<PhotoProps> {
  constructor(props: Optional<PhotoProps, 'deliveryId'>, id?: string) {
    super(props, id);
  }

  get deliveryId(): string | undefined {
    return this.props.deliveryId;
  }

  get link(): string {
    return this.props.link;
  }

  confirmPhoto(deliveryId: string): void {
    if (!!this.props.deliveryId) {
      throw new PhotoAlreadyConfirmedError();
    }
    this.props.deliveryId = deliveryId;
  }
}
