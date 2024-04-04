import { Uploader } from '@/domain/deliveries/storage/uploader';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { R2Uploader } from './r2-uploader';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Uploader,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
