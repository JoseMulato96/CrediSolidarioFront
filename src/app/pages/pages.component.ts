import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService } from '@core/services';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

  private _subs: Subscription[] = [];

  private _onRefresh = false;

  constructor(
    private readonly alertService: AlertService,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly idle: Idle, private readonly keepalive: Keepalive) {

    // Inicializa el proceso de validacion de sesion
    this.validateSession();
  }

  ngOnInit() {
    // do nothing
  }

  validateSession() {
    const seconds = this.authenticationService.getExpiresInToken();
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(seconds);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(1);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this._subs.push(
      this.idle.onTimeout.subscribe(() => {
        this.translate.get('security.sesionCaduca').subscribe((text: string) => {
          this.alertService.info(text).then(() => {
            this.authenticationService.logout();
            this.router.navigate(['login']);
          });
        });
      }));
    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this._subs.push(this.keepalive.onPing.subscribe(() => {
      if (!this._onRefresh && (this.getSecondsTokenExpiration() <= 120)) {
        this._onRefresh = true;
        this.authenticationService.refresh().subscribe(() => {
          this._onRefresh = false;
        }, err => {
          this._onRefresh = false;
          const minutes = this.getSecondsTokenExpiration() / 60;
          if (minutes > 0) {
            this.translate.get('security.noRefreshToken', { tiempo: Math.round(minutes) }).subscribe((text: string) => {
              this.alertService.error(text);
            });
          } else {
            this.translate.get('security.refreshTokenError').subscribe((text: string) => {
              this.alertService.error(text).then(() => {
                this.authenticationService.logout();
                this.router.navigate(['login']);
              });
            });
          }
        });
      }
    }));

    // start idle
    this.idle.watch();
  }

  getSecondsTokenExpiration() {
    // se calcula los tiempos que llegan del token
    return ((this.authenticationService.getTokenExpirationDate().getTime() - new Date().getTime()) / 1000);
  }

  ngOnDestroy() {
    this._subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this._subs = undefined;
  }

}
