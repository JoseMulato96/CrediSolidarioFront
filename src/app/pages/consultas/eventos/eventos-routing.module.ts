import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { EventosComponent } from './eventos.component';
import { ConsultaEventosComponent } from './consulta/consulta.component';
import { RentasComponent } from './consulta/rentas/rentas.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';

const routes: Routes = [
  {
    path: '',
    component: EventosComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_RECLAMACIONES], permisos: [CodigosPermisos.CONSULTAR]
    },
    children: [
      {
        path: UrlRoute.CONSULTAS_EVENTOS_CONSULTA,
        component: ConsultaEventosComponent
      },
      {
        path: `:asoNumInt/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD}`,
        loadChildren: () => import('./consulta/solicitud/solicitud.module').then(m => m.SolicitudModule)
      },
      {
        path: `${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_RENTAS}/:idProceso`,
        component: RentasComponent
      },
      {
        path: '',
        redirectTo: UrlRoute.CONSULTAS_EVENTOS_CONSULTA,
        pathMatch: 'full'
      }
    ]
  }
];

export const EventosRoutingModule = RouterModule.forChild(routes);
