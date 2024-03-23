import { Geocoder } from '@/domain/administration/addresses/geocoder';
import { faker } from '@faker-js/faker';

export class FakeGeocoder implements Geocoder {
  async getCoordinates() {
    return {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
  }
}
