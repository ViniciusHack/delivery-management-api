import { Photo } from '@/domain/deliveries/entities/photo';
import { faker } from '@faker-js/faker';

export function makePhoto(override?: Partial<Photo>): Photo {
  return new Photo({
    link: `/${faker.string.uuid()}`,
    ...override,
  });
}
