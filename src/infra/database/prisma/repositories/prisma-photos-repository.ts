import { Photo } from '@/domain/deliveries/entities/photo';
import { PhotosRepository } from '@/domain/deliveries/repositories/photos-repository';
import { Injectable } from '@nestjs/common';
import { PrismaPhotoMapper } from '../mappers/prisma-photo-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPhotosRepository implements PhotosRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: {
        id,
      },
    });

    return photo ? PrismaPhotoMapper.toDomain(photo) : null;
  }

  async create(photo: Photo) {
    await this.prisma.photo.create({
      data: PrismaPhotoMapper.toPersistence(photo),
    });
  }

  async update(photo: Photo): Promise<void> {
    await this.prisma.photo.update({
      where: {
        id: photo.id,
      },
      data: PrismaPhotoMapper.toPersistence(photo),
    });
  }
}
