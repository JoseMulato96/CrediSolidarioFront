import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, AuthenticationService } from '@core/services';

export interface FormComponent {
  hasChanges: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<FormComponent> {

  constructor(private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly authService: AuthenticationService) { }

  canDeactivate(component: FormComponent,
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Si el token ya expiro dejamos que el observador de seguridad se encargue de sacar la sesion.
    if (this.authService.isTokenExpired()) {
      return true;
    }

    if (component.hasChanges()) {
      return this.alertService.confirm(this.translate.instant('global.onDeactivate'));
    }

    return true;
  }
}
