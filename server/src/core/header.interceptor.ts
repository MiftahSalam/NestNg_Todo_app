import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Response } from 'express'

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse()
    response.setHeader(
      'Content-Security-Policy',
      'script-src "self" "unsafe-inline"',
    )
    Logger.log(
      'header after intercepted:',
      response.getHeaders(),
      'HeaderIterceptor',
    )
    return next.handle()
  }
}
