import { Photo } from '../entities/photo';

export abstract class PhotosRepository {
  abstract findById(id: string): Promise<Photo | null>;
  abstract update(photo: Photo): Promise<void>;
}
