import { Entity } from '@/core/entity';
import { Optional } from '@/core/utils';

interface NotificationProps {
  title: string;
  message: string;
  recipientId: string;
  createdAt: Date;
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

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
