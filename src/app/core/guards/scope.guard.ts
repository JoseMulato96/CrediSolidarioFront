import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ScopeService, AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ScopeGuard {

  constructor(private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly scopeService: ScopeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const codigos = route.data.codigos;
    const permisos = route.data.permisos;
    const menu = this.scopeService.obtenerMenu(codigos, false);

    if (!menu || !permisos) {
      this.translate.get('error.403.mensajeMenu').subscribe((response: string) => {
        this.alertService
          .error(response);
      });
      return false;
    }

    // Validamos cada permiso
    let tienePermisos = true;
    permisos.forEach(permiso => {
      tienePermisos = tienePermisos && this.scopeService.tienePermisos(permiso, menu.appObject.operations);
    });

    if (!tienePermisos) {
      this.translate.get('error.403.mensajeMenu').subscribe((response: string) => {
        this.alertService
          .error(response);
      });
      return false;
    }

    return true;
  }
}
