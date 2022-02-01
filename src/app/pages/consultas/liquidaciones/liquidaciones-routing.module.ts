import { Routes, RouterModule } from '@angular/router';
import { LiquidacionesComponent } from './liquidaciones.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ConsultaLiquidacionesComponent } from './consulta-liquidaciones/consulta-liquidaciones.component';
import { DetalleLiquidacionComponent } from './consulta-liquidaciones/detalle-liquidacion/detalle-liquidacion.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';

const routes: Routes = [

  {
    path: '',
    component: LiquidacionesComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_LIQUIDACIONES], permisos: [CodigosPermisos.CONSULTAR]
    },
    children: [
      {
        path: '',
        redirectTo: UrlRoute.CONSULTAS_LIQUIDACIONES_CONSULTA_LIQUIDACIONES,
        pathMatch: 'full'
      },
      {
        path: UrlRoute.CONSULTAS_LIQUIDACIONES_CONSULTA_LIQUIDACIONES,
        component: ConsultaLiquidacionesComponent
      },
      {
        path: ':numeroLiquidacion/:numeroReclamacion/' + UrlRoute.CONSULTAS_LIQUIDACIONES_CONSULTA_LIQUIDACIONES_DETALLE_LIQUIDACION,
        component: DetalleLiquidacionComponent
      },
      {
        path: ':codigoLiquidacion',
        component: LiquidacionComponent
      }
    ]
  }

];

export const LiquidacionesRoutingModule = RouterModule.forChild(routes);
