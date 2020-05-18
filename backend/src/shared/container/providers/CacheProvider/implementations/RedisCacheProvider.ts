import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';
import ICacheProvider from '../protocols/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async retrieve<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidateByPrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }
}
