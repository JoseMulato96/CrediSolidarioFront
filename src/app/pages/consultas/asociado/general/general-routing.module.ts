import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ActIndFechaNacimientoComponent } from './act-ind-fecha-nacimiento/act-ind-fecha-nacimiento.component';
import { ActAuxFunerarioComponent } from './act-ind-auxilio-funerario/act-auxilio-funerario.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';

const routes: Routes = [
  {
    path: '', component: GeneralComponent, children: [
      {
        path: UrlRoute.GENERAL_ACT_IND_AUX_FUN,
        component: ActAuxFunerarioComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL_AUX_FUN], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.GENERAL_ACT_IND_FEC_NAC,
        component: ActIndFechaNacimientoComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL_IND_FEC_NAC], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      { path: '', redirectTo: UrlRoute.GENERAL_ACT_IND_FEC_NAC, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
