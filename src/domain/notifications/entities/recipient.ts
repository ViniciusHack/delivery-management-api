import { Entity } from '../../../core/entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RecipientProps {}

export class Recipient extends Entity<RecipientProps> {
  constructor(props: RecipientProps, id?: string) {
    super(props, id);
  }
}
