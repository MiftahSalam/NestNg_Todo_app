import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HeaderInterceptor } from './header.interceptor'
import { HttpExceptionFilter } from './http-exception.filter'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    HeaderInterceptor,
  ],
})
export class CoreModule {}
