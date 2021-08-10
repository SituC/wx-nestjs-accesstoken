import { Module } from '@nestjs/common';
import { EnvModule } from './env/env';
import { AccessTokenModule } from './accessToken/accessToken.module'
@Module({
  // 这儿得将业务拆分到具体的Module中，这样才能让代码业务顺序在envModule之后
  // 也就是说在accesstoken业务中获取env环境变量
  imports: [EnvModule, AccessTokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
