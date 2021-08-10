import { Module } from '@nestjs/common';
import { AccessTokenController } from './accessToken.controller';
import { AccessTokenService } from './accessToken.service';
import { LoggerModule, Log4jsLoggerService } from '../logs/logs';
import { AxiosService } from '../axios/axios.service';
import { AxiosModule } from '../axios/axios.module';
import { RedisBaseModule } from '../redis/redis.module';
@Module({
  imports: [LoggerModule, AxiosModule, RedisBaseModule],
  controllers: [AccessTokenController],
  providers: [AccessTokenService, Log4jsLoggerService, AxiosService],
})
export class AccessTokenModule {}
