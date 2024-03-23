import { Addressee } from '@/domain/deliveries/entities/addressee';
import { AddresseesRepository } from '@/domain/deliveries/repositories/addressees-repository';

export class InMemoryAddresseesRepository implements AddresseesRepository {
  public items: Addressee[] = [];

  async findById(id: string) {
    return this.items.find((addressee) => addressee.id === id) ?? null;
  }

  async create(addressee: Addressee) {
    this.items.push(addressee);
  }

  async update(addressee: Addressee) {
    const index = this.items.findIndex((c) => c.id === addressee.id);
    this.items[index] = addressee;
  }

  async delete(id: string) {
    this.items = this.items.filter((addressee) => addressee.id !== id) ?? null;
  }
}
