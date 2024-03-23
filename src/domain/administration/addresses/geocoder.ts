export abstract class Geocoder {
  abstract getCoordinates(address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }): Promise<{ latitude: number; longitude: number }>;
}
