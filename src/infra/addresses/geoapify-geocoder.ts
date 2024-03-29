import { Geocoder } from '@/domain/administration/addresses/geocoder';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EnvService } from '../env/env.service';

interface GeoapifyResponse {
  features: {
    geometry: {
      coordinates: [number, number];
    };
  }[];
}

@Injectable()
export class GeoapifyGeocoder implements Geocoder {
  constructor(private env: EnvService) {}

  async getCoordinates({ street, number, city, country, zipCode }) {
    const apiKey = this.env.get('GEOAPIFY_KEY');
    const url = `https://api.geoapify.com/v1/geocode/search?housenumber=${number}&street=${street}&postcode=${zipCode}&city=${city}&country=${country}&apiKey=${apiKey}`;
    const response = await axios.get<GeoapifyResponse>(url);

    const [longitude, latitude] =
      response.data.features[0].geometry.coordinates;

    return {
      latitude,
      longitude,
    };
  }
}
