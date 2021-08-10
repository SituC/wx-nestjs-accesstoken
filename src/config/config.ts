export const config = {
  /**
   * 服务环境：开发-development; 测试-test; 生产-production
   * 请在.env.*文件中修改环境变量配置
   * 您也可以通过docker配置环境变量
  */
  env: process.env.NODE_ENV || 'development',
  webUrl: process.env.APP_HOST || 'http://localhost:3000', // 本服务域名
  swagger: '/api', // swagger地址前缀
  /**
   * 微信应用appId和appSecret
   * 需要您在根目录创建.env.development和.env.production文件，然后将环境变量写进文件中
   * 涉及敏感参数，本项目未上传配置文件
   * 例子：
   * .env.development
   * NODE_ENV = development
   * APP_HOST = http://localhost
   * APP_PORT = 3000
   * WX_APP_ID = 
   * WX_APP_SECRET = 
   * # redis
   * REDIS_HOST = 127.0.0.1
   * REDIS_PORT = 6379
   */
  appId: process.env.WX_APP_ID || '',
  appSecret: process.env.WX_APP_SECRET || '',
  // redis 集群
  redis: {
    cluster: [],
  }
}
// console.log(process.env)
const redis = {
  // 生产环境集群
  prod: [{
    host: 'redis1',
    port: '1234'
  }, {
    host: 'redis2',
    port: '1235'
  }, {
    host: 'redis3',
    port: '1236'
  }],
  // 测试环境一台
  test: [{
    host: 'localhost',
    port: '6379'
  }],
  // 开发环境一台
  dev: [{
    host: 'localhost',
    port: '6379'
  }]
} as const
config.redis.cluster = redis[config.env]
