import { randomUUID } from 'node:crypto';

export class Entity<Props> {
  protected readonly _id: string;
  protected props: Props;

  protected constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }
}
