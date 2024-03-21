import { Recipient } from '../entities/recipient';

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<Recipient | null>;
}
