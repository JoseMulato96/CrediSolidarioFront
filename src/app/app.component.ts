import { registerLocaleData } from '@angular/common';
import locale_esCO from '@angular/common/locales/es-CO';
import { Component, ɵLocaleDataIndex } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ConnectionService } from 'ng-connection-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly connectionService: ConnectionService
  ) {
    translate.setDefaultLang('es');
    registerLocaleData(locale_esCO);

    // Actualmente el CurrencyPipe de Angular no soporta configurar un LOCALE por defecto.
    // Como solucion se sobre escribe el simbolo USD pot $.
    // Ver https://github.com/angular/angular/issues/25461
    const currencySymbols = locale_esCO[ɵLocaleDataIndex.Currencies];
    currencySymbols['USD'] = ['$', '$'];
    registerLocaleData(locale_esCO, 'en');

    this.connectionService.monitor().subscribe(isConnected => {
      if (!isConnected) {
        this.translate.get('global.noInternet').subscribe(text => {
          this.alertService.info(text).then(confirm => {
            this.authenticationService.logout();
            this.router.navigate([UrlRoute.LOGIN]);
          });
        });
      }
    });
  }
}
