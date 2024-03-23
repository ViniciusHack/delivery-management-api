import { Geocoder } from '@/domain/administration/addresses/geocoder';
import { faker } from '@faker-js/faker';

export class FakeGeocoder implements Geocoder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getCoordinates(_) {
    return {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
  }
}
