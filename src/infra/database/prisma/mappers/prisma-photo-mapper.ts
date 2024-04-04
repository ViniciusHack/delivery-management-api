import { Photo } from '@/domain/deliveries/entities/photo';
import { Prisma, Photo as PrismaPhoto } from '@prisma/client';

export class PrismaPhotoMapper {
  static toDomain(photo: PrismaPhoto) {
    return new Photo(
      {
        link: photo.link,
        deliveryId: photo.deliveryId ?? undefined,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt ?? undefined,
      },
      photo.id,
    );
  }

  static toPersistence(photo: Photo): Prisma.PhotoUncheckedCreateInput {
    return {
      id: photo.id,
      link: photo.link,
      deliveryId: photo.deliveryId,
      createdAt: photo.createdAt,
    };
  }
}
