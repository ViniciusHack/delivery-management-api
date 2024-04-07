import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { CacheRepository } from './cache-repository';
import { RedisCacheRepository } from './redis-cache-repository';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
