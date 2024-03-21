import { Recipient } from '@/domain/notifications/entities/recipient';
import { RecipientsRepository } from '@/domain/notifications/repositories/recipients-repository';

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async findById(id: string) {
    return this.items.find((recipient) => recipient.id === id) ?? null;
  }

  async update(recipient: Recipient) {
    const index = this.items.findIndex((c) => c.id === recipient.id);
    this.items[index] = recipient;
  }
}
