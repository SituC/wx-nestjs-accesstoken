import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable, Module, Logger } from '@nestjs/common';

@Injectable()
export class EnvService {
  private readonly envConfig: {[key: string]: string};
  private readonly logger = new Logger()
  constructor(filePath: string) {
      // 读取.env文件，通过dotenv.parse方法形成key-value pairs
      // 存在envConfig变量里
      try {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
        for (const i in this.envConfig) {
          process.env[i] = this.envConfig[i]
        }
      } catch (error) {
        this.logger.log(error)
        // console.log(error)
      }

  }
  // 传进來key，回传value
  get(key: string){
      return this.envConfig[key];
  }
}
@Module({
  providers: [
    // 这是nestjs另外一种Dependency Injection的方式
    {
      // 如果nestjs IoC Container要ConfigService的时候
      provide: EnvService,
      // 回传"这个"值
      // 刚刚的ConfigService要传入.env路径及文件名
      useValue: new EnvService(`.env.${process.env.NODE_ENV || 'development'}`),
    },
  ],
  // export表示这个Module被import后，ConfigService可以被其他Module Inject
  exports: [EnvService],
})
export class EnvModule {}
