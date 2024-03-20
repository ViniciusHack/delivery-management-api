import { Entity } from '@/core/entity';

interface NotificationProps {
  title: string;
  message: string;
  recipientId: string;
  createdAt: Date;
  readAt?: Date;
  updatedAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
  constructor(props: NotificationProps) {
    super(props);
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
    this.props.readAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
