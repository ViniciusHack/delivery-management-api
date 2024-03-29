import { Geocoder } from '@/domain/administration/addresses/geocoder';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { GeoapifyGeocoder } from './geoapify-geocoder';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Geocoder,
      useClass: GeoapifyGeocoder,
    },
  ],
  exports: [Geocoder],
})
export class AddressesModule {}
