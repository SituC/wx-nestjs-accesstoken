import { Module, HttpModule } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  imports: [HttpModule],
  providers: [AxiosService],
  exports: [AxiosService, HttpModule]
})
export class AxiosModule {}
