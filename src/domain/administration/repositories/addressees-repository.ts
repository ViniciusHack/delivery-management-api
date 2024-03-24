import { Addressee } from '../entities/addressee';

export abstract class AddresseesRepository {
  abstract findById(id: string): Promise<Addressee | null>;
  abstract findByEmail(email: string): Promise<Addressee | null>;
  abstract create(addressee: Addressee): Promise<void>;
  abstract update(addressee: Addressee): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
