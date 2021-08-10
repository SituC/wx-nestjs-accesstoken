import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs'
@Injectable()
export class AxiosService {
  constructor(private readonly http: HttpService) {}

  
  get(url: string): Promise<any>  {
    return this.http.get(url).toPromise();
  }

  post(url: string, data?: any): Promise<any> {
    return this.http.post(url, data).toPromise();
  }
}