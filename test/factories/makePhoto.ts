import { Photo } from '@/domain/deliveries/entities/photo';
import { PrismaPhotoMapper } from '@/infra/database/prisma/mappers/prisma-photo-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makePhoto(override?: Partial<Photo>): Photo {
  return new Photo({
    link: `/${faker.string.uuid()}`,
    ...override,
  });
}

@Injectable()
export class PhotoFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPhoto(override?: Partial<Photo>) {
    const data = makePhoto(override);

    await this.prisma.photo.create({
      data: PrismaPhotoMapper.toPersistence(data),
    });

    return data;
  }
}
