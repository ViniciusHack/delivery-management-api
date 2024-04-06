import { Recipient } from '@/domain/notifications/entities/recipient';
import { Addressee } from '@prisma/client';

export class RecipientMapper {
  static toDomain(recipient: Addressee): Recipient {
    return new Recipient({
      email: recipient.email,
    });
  }
}
