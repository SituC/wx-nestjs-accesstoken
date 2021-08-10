import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { swaggerConfig } from './swagger/swagger.config';
import { Logger } from '@nestjs/common';
import { config } from './config/config'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(config.swagger, app, document);
  await app.listen(process.env.APP_PORT);
  new Logger().log(`服务器启动成功端口 ${process.env.APP_HOST}:${process.env.APP_PORT}`);
  new Logger().log(`接口文档查看地址 ${process.env.APP_HOST}:${process.env.APP_PORT}${config.swagger}`);
}
bootstrap();
