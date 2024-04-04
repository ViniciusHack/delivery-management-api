import { Photo } from '@/domain/deliveries/entities/photo';

export class PhotoPresenter {
  static toHTTP(photo: Photo) {
    return {
      id: photo.id,
      // link: photo.link,
    };
  }
}
