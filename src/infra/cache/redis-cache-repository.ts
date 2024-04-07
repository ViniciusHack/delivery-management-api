import { CacheRepository } from './cache-repository';
import { RedisService } from './redis.service';

export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async get(key: string) {
    return await this.redis.get(key);
  }

  async set(key: string, value: string) {
    await this.redis.set(key, value);
  }

  async delete(key: string) {
    await this.redis.del(key);
  }
}
