import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FrecuenciaFacturacionComponent } from './frecuencia-facturacion.component';
import { GuardarFrecuenciaFacturacionComponent } from './guardar-frecuencia-facturacion/guardar-frecuencia-facturacion.component';
import { ListarFrecuenciaFacturacionComponent } from './listar-frecuencia-facturacion/listar-frecuencia-facturacion.component';

const routes: Routes = [
  {
    path: '',
    component: FrecuenciaFacturacionComponent,
    children: [
      { path: '', component: ListarFrecuenciaFacturacionComponent },
      { path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_NUEVO, component: GuardarFrecuenciaFacturacionComponent, canDeactivate: [CanDeactivateGuard] },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_CODIGO_PLAN + '/:codigoPlan/' +
          UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_CODIGO_PERIODO_FACTURACION + '/:codigoPeriodoFacturacion',
        component: GuardarFrecuenciaFacturacionComponent, canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrecuenciaFacturacionRoutingModule { }
