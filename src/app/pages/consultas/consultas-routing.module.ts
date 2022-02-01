import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ConsultaLogTransaccionalComponent } from './consulta-log-transaccional/consulta-log-transaccional.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ConsultaAsociadosComponent } from './consulta-asociados/consulta-asociados.component';
import { ConsultaPagosComponent } from './contulta-pagos/consulta-pagos.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
  {
    path: '',
    redirectTo: UrlRoute.CONSULTA_LOG_TRANSACCIONAL,
    pathMatch: 'full',
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_LOG_TRANSACCIONAL], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.CONSULTA_ASOCIADOS,
    component: ConsultaAsociadosComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_ASOCIADOS], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.CONSULTAS_ASOCIADO + '/:asoNumInt',
    loadChildren: () => import('./asociado/asociado.module').then(m => m.AsociadoModule),
    canActivate: [ScopeGuard],
    data: {
      preload: true,
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_ASOCIADOS], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.BENEFICIARIOS,
    loadChildren: () => import('./beneficiarios/beneficiarios.module').then(m => m.BeneficiariosModule)
  },
  {
    path: UrlRoute.CONSULTAS_LIQUIDACIONES,
    loadChildren: () => import('./liquidaciones/liquidaciones.module').then(m => m.LiquidacionesModule),
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_LIQUIDACIONES], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.CONSULTAS_EVENTOS,
    loadChildren: () => import('./eventos/eventos.module').then(m => m.ReclamacionesModule),
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_RECLAMACIONES], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.CONSULTA_PAGOS,
    component: ConsultaPagosComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_PAGOS], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.CONSULTA_LOG_TRANSACCIONAL,
    component: ConsultaLogTransaccionalComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.CONSULTAS,
        CodigosMenu.CONSULTAS_LOG_TRANSACCIONAL], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
