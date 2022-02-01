import { registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import locale_esCO from '@angular/common/locales/es-CO';
import localeCoExtra from '@angular/common/locales/extra/es-CO';
import { LOCALE_ID, NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { ErrorInterceptor, JwtInterceptor } from '@core/interceptors';
import { reducers } from '@core/store/reducers';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from '@shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LoginComponent } from './login/login.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgxTinymceModule } from 'ngx-tinymce';
import { environment } from '@environments/environment';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

export function tokenGetter() {
  const storage = sessionStorage.getItem('token');
  return storage ? JSON.parse(storage).access_token : undefined;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(locale_esCO, 'es-CO', localeCoExtra);

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgIdleKeepaliveModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule.forRoot(),
    NgxMaskModule.forRoot(),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    NgxUiLoaderModule.forRoot({
      bgsColor: '#0E8652',
      bgsOpacity: 1,
      bgsPosition: 'bottom-right',
      bgsSize: 50,
      bgsType: 'circle',
      minTime: 300,
      pbColor: '#FFFFFF',
      fgsColor: '#FFFFFF',
      overlayColor: '#0E8652',
      fgsType: 'circle'
    }),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: false
    }),
    NgxUiLoaderRouterModule.forRoot({
      showForeground: false
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    NgxTinymceModule.forRoot({
      baseURL: './assets/tinymce/'
    }),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
