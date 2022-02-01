import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProteccionesAsociadosComponent } from './protecciones-asociados.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { RegistrarPortafolioAsociadosComponent } from './registrar-portafolio-asociados/registrar-portafolio-asociados.component';
import { PortafolioAsociadosComponent } from './portafolio-asociados/portafolio-asociados.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
  {
    path: '',
    component: ProteccionesAsociadosComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_ASOCIADOS,
      CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES], permisos: [CodigosPermisos.CONSULTAR]
    },
    children: [
      {
        path: '',
        redirectTo: UrlRoute.PORTAFOLIO_ASOCIADOS,
        pathMatch: 'full',
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES_PORTAFOLIO], permisos: [CodigosPermisos.CONSULTAR]
        },
      },
      {
        path: UrlRoute.PORTAFOLIO_ASOCIADOS,
        component: PortafolioAsociadosComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES_PORTAFOLIO], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE + '/:consecutivo',
        loadChildren:
          () => import('./portafolio-asociados-detalle/portafolio-asociados-detalle.module').then(m => m.PortafolioAsociadosDetalleModule),
        canActivate: [ScopeGuard],
        data: {
          preload: true,
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES_PORTAFOLIO], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.PORTAFOLIO_BETA,
        loadChildren: () => import('./portafolio-plan-cobertura/portafolio-plan-cobertura.module').then(m => m.PortafolioPlanCoberturaModule)
      },

      {
        path: UrlRoute.REGISTRAR_PORTAFOLIO_ASOCIADOS,
        component: RegistrarPortafolioAsociadosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProteccionesAsociadosRoutingModule { }
