import { Recipient } from '@/domain/notifications/entities/recipient';

export function makeRecipient(override?: Partial<Recipient>): Recipient {
  return new Recipient({
    email: 'johndoe@email.com',
    ...override,
  });
}
