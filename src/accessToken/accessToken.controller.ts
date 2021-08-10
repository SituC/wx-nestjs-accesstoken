import { Controller, Post, Get, Request, Response, Body, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiParam, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { AccessTokenService } from './accessToken.service'
import { Log4jsLoggerService } from '../logs/logs';
import { config } from '../config/config'
@Controller('auth')
@ApiTags('access-token')
export class AccessTokenController {
  constructor(
    // private readonly logger: Log4jsLoggerService,
    private readonly accesstoken: AccessTokenService
  ) {}

  @Get('get_access_token')
  async get_access_token() {
    const result = await this.accesstoken.getAccessToken().catch(e => e)
    return result
  }

  @Get('clean_access_token')
  async clean_access_token() {
    const result = await this.accesstoken.clearAccessToken().catch(e => e)
    return result
  }
}
