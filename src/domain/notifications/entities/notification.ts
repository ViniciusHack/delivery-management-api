import { Entity } from '@/core/entity';
import { Optional } from '@/core/utils';
import { NotificationAlreadyRead } from './errors/notification-already-read';

interface NotificationProps {
  title: string;
  message: string;
  recipientId: string;
  createdAt: Date;
  readAt?: Date;
  updatedAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
  constructor(props: Optional<NotificationProps, 'createdAt'>, id?: string) {
    super({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }

  get title(): string {
    return this.props.title;
  }

  get message(): string {
    return this.props.message;
  }

  get recipientId(): string {
    return this.props.recipientId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get readAt(): Date | undefined {
    return this.props.readAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public read(): void {
    if (this.props.readAt) {
      throw new NotificationAlreadyRead();
    }
    this.props.readAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
