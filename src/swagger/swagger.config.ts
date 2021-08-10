import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('accesstoken接口文档')
  .setDescription('微信服务器交互接口')
  .setVersion('1.0.0')
  .build()

