import { config } from '../config/config';
import { Injectable } from '@nestjs/common';
import { Log4jsLoggerService } from '../logs/logs';
import { ApiReturnType } from './accessToken.type';
import { RedisCacheService } from '../redis/redis.service';
import { AxiosService } from '../axios/axios.service';
@Injectable()
export class AccessTokenService {
  private accessTokenName
  constructor(
    private readonly logger: Log4jsLoggerService,
    private readonly redis: RedisCacheService,
    private readonly axios: AxiosService
  ) {
    const hostname = new URL(config.webUrl).hostname
    const prefix = hostname.replace(/\./ig, '-')
    this.accessTokenName = `${prefix}_wx-accessToken`
  }
  async getAccessToken(): Promise<ApiReturnType> {
    this.logger.info('getAccessToken -this.accessTokenName:', this.accessTokenName)
    let accessToken
    try {
      accessToken = await this.redis.get({key: this.accessTokenName})
      // 验证accessToken是否已经过期
      const url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + accessToken
      const result = await this.axios.post(url)
      this.logger.info('Accesstoken check', result.data)
      // 如果 40001说明accesstoken过期，则重新获取
      if (result.data.errcode === 40001) {
        accessToken = null
      }
    } catch (error) {
      this.logger.info(error)
    }
    this.logger.info('获取access token', accessToken)
    if (accessToken) {
      this.logger.info('getAccessToken hit cache:', accessToken)
      return {
        code: 0,
        data: {
          isCached: true,
          access_token: accessToken,
        },
      }
    } else {
      this.logger.info('获取access token')
      const result = await this.fetchAccessToken()
      return result
    }
  }

  async fetchAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
    this.logger.trace(`fetchAccessToken - ${url}`)
    const result = await this.axios.get(url).then(res => {
      const accessToken = res.data.access_token
      if (accessToken) {
        this.logger.info('fetchAccessToken success:', res.data)
        // set cache 因为微信平台会保证5分钟内，新老access_token都可用，再考虑到请求延迟 我们额外扩展4分钟，在刷新成功后，会直接更新accessToken
        this.redis.set({
          key: this.accessTokenName, 
          value: accessToken,
          seconds: res.data.expires_in + 4 * 60
        })
        return {
          code: 0,
          data: {
            isCached: false,
            access_token: accessToken,
          },
        }
      } else {
        this.logger.error('fetchAccessToken fail:', res.data)
        return {
          code: 1,
          data: res.data,
        }
      }
    }).catch(e => {
      this.logger.error('fetchAccessToken network error:', e)
      return {
        code: 502,
        data: e,
      }
    })
    return result
  }

  async clearAccessToken() {
    const result = await this.redis.clear({ key: this.accessTokenName });
    return {
      code: result,
      data: result === 0 ? '没有该属性缓存' : '删除成功'
    }
  }
}