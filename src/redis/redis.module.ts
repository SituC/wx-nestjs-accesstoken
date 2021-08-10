import { Module } from '@nestjs/common';
// redis使用
import { RedisModule } from 'nestjs-redis';
import { RedisCacheService } from './redis.service';
import { LoggerModule, Log4jsLoggerService } from '../logs/logs';
@Module({
  imports: [
    LoggerModule,
    RedisModule.register({
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      password: '',
      db: 0,
    }),
  ],
  providers: [RedisCacheService, Log4jsLoggerService],
  exports: [RedisCacheService],
})
export class RedisBaseModule {}
