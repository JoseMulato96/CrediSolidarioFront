import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly ngxService: NgxUiLoaderService,
    private readonly translate: TranslateService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // Intentamos detener el spiner siempre y evitar posibles bloqueos del usuario
        // al navegar por el aplicativo.
        this.ngxService.stop();

        switch (err.status) {
          case 0:
            // Catch ERR_CONNECTION_TIMED_OUT here
            this.translate.get('error.0.mensajeErrConnectionTimedOut').subscribe((response: string) => {
              this.alertService
                .error(response)
                .then(() => {
                  this.router.navigate(['/']);
                });
            });

            return of(err);
          case 401:
            this.translate.get('error.401.mensaje').subscribe((response: string) => {
              this.alertService.error(response).then(() => {
                this.auth.logout();
                this.router.navigate(['/login']);
              });
            });

            return of(err);
          case 403:
            this.translate.get('security.noPermisos').subscribe((response: string) => {
              this.alertService
                .error(response)
                .then(() => {
                  this.router.navigate(['/']);
                });
            });

            return of(err);
          case 500:
            const observables = [];

            if (err.error.description) {
              observables.push(of(err.error.description));
            } else if (err.error.message) {
              observables.push(of(err.error.message));
            } else {
              observables.push(this.translate.get('error.500.mensaje'));
            }

            if (err.error.traza) {
              observables.push(of(err.error.traza));
            } else {
              observables.push(this.translate.get('error.500.mensajeDetalleTecnico'));
            }

            if (err.url.includes('sispro')) {
              return throwError(err);
            }

            /* forkJoin(observables).subscribe((result: any[]) => {
              this.alertService
                .error(
                  result[0],
                  result[1]
                ).then(() => {
                  this.ngxService.stop();
                });
            }); */

            // Retornamos el error para tratarlo desde el componente de ser necesario.
            // return of(err);
            return throwError(err);
          case 503:
            this.translate.get('error.503.mensaje').subscribe((response: string) => {
              this.alertService
                .error(response)
                .then(() => {
                  this.router.navigate(['/']);
                });
            });

            return of(err);
          default:
            // Por defecto lanzamos el error para ser capturado desde el componente.
            return throwError(err);
        }
      })
    );
  }
}
