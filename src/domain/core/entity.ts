import { randomUUID } from 'node:crypto';

export class Entity<Props> {
  public readonly _id: string;
  public props: Props;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }
}
