import { Photo } from '@/domain/deliveries/entities/photo';
import { PhotosRepository } from '@/domain/deliveries/repositories/photos-repository';

export class InMemoryPhotosRepository implements PhotosRepository {
  public items: Photo[] = [];

  async findById(id: string) {
    return this.items.find((photo) => photo.id === id) ?? null;
  }

  async create(photo: Photo) {
    this.items.push(photo);
  }

  async update(photo: Photo) {
    const index = this.items.findIndex((c) => c.id === photo.id);
    this.items[index] = photo;
  }
}
