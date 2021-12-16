import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('ErrorInterceptor');

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === HttpStatusCode.Unauthorized &&
          !window.location.href.includes('/login')
        ) {
          this.authService.logout();
          location.reload();
        }

        const error = err.error.error || err.error.message || err.statusText;
        alert(error);

        return throwError(() => {
          return error;
        });
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
