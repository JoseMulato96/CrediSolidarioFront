import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@core/services';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private readonly refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(private readonly authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.indexOf('refresh_token') !== -1) {
      return next.handle(request);
    }

    const accessExpired = this.authenticationService.isTokenExpired();
    const refreshExpired = this.authenticationService.isRefreshTokenExpired();

    if (accessExpired && refreshExpired) {
      return next.handle(request);
    }
    if (accessExpired && !refreshExpired) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);
        return this.authenticationService.refresh().pipe(
          switchMap((authResponse) => {
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(authResponse);
            return next.handle(this.injectToken(request));
          }),
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter(result => result !== null),
          take(1),
          switchMap((res) => {
            return next.handle(this.injectToken(request));
          })
        );
      }
    }

    if (!accessExpired) {
      return next.handle(this.injectToken(request));
    }
  }

  injectToken(request: HttpRequest<any>) {
    const token = this.authenticationService.getToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
