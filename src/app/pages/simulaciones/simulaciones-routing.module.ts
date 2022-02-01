import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { ValorDevolverComponent } from './valor-devolver/valor-devolver.component';
import { ValorDevolverCancelacionComponent } from './valor-devolver-cancelacion/valor-devolver-cancelacion.component';
import { SimulacionesComponent } from './simulaciones.component';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
  {
    path: '',
    component: SimulacionesComponent,
    children: [
      {
        path: '',
        component: ValorDevolverComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [
            CodigosMenu.SIMULACIONES,
            CodigosMenu.SIMULACIONES_VALOR_DEVOLVER], permisos: [CodigosPermisos.CONSULTAR]
        }
      }, {
        path: UrlRoute.VALOR_DEVOLVER,
        component: ValorDevolverComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [
            CodigosMenu.SIMULACIONES,
            CodigosMenu.SIMULACIONES_VALOR_DEVOLVER], permisos: [CodigosPermisos.CONSULTAR]
        }
      }, {
        path: UrlRoute.VALOR_DEVOLVER_CANCELADOS,
        component: ValorDevolverCancelacionComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [
            CodigosMenu.SIMULACIONES,
            CodigosMenu.SIMULACIONES_VALOR_DEVOLVER
          ], permisos: [CodigosPermisos.CONSULTAR]
        }
      }
    ]
  }, { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulacionesRoutingModule {



}
