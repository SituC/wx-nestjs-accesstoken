import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { SetType, GetType } from './redis.type';
import { Log4jsLoggerService } from '../logs/logs';
@Injectable()
export class RedisCacheService {
  private client;
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: Log4jsLoggerService,

  ) {
    this.getClient();
  }
  async getClient() {
    this.client = await this.redisService.getClient();
  }
  // 设置数据
  async set({ key, value, seconds }: SetType) {
    value = JSON.stringify(value);
    // 因为获取client是异步，这里可能还没有获取到实例
    if (!this.client) {
      await this.getClient();
    }
    if (seconds) {
      await this.client.set(key, value, 'EX', seconds);
      this.logger.log('redis set success', 'key=> ' + key, 'value=> ' + value, 'seconds=> ' + seconds)
    } else {
      await this.client.set(key, value);
      this.logger.log('redis set success', 'key: ' + key, 'value: ' + value)
    }
  }
  // 获取数据
  async get({ key }: GetType) {
    if (!this.client) {
      await this.getClient();
    }
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    this.logger.log('redis get success', JSON.parse(data))
    return JSON.parse(data);
  }
  // 清空
  async clear({ key }: GetType) {
    const result = await this.client.del(key)
    return result
  }
}
