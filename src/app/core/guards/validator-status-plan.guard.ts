import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { FrontFacadeService, BackFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';

@Injectable()
export class CanActivateValidatorStatusPlanGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return new Promise(resolve => {
      this.backService.planes.getPlan(next.params.codigoPlan).subscribe(response => {
        if (response && response.mimFaseFlujo &&
          response.mimFaseFlujo.codigo !== MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA) {
          this.translate.get('administracion.protecciones.planCobertura.alertas.estadosDiferenteTecnicoEditar').subscribe(text => {
            this.frontService.alert.info(text).then(confirm => {
              this.router.navigate([
                UrlRoute.PAGES,
                UrlRoute.ADMINISTRACION,
                UrlRoute.ADMINISTRACION_APROBACION_FINAL,
                UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR,
                next.params.codigoPlan,
                UrlRoute.SOLICITUD_APROBACION
              ]);
            });
          });
        }
      });
      resolve(true);
    });
  }
}
