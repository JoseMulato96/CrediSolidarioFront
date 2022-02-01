import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { MediosFacturacionComponent } from './medios-facturacion.component';
import { ListarMediosFacturacionComponent } from './listar-medios-facturacion/listar-medios-facturacion.component';
import { GuardarMediosFacturacionComponent } from './guardar-medios-facturacion/guardar-medios-facturacion.component';

const routes: Routes = [
  {
    path: '',
    component: MediosFacturacionComponent,
    children: [
      { path: '', component: ListarMediosFacturacionComponent },
      { path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_NUEVO, component: GuardarMediosFacturacionComponent, canDeactivate: [CanDeactivateGuard] },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_CODIGO_PLAN +
          '/:codigoPlan/' + UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_CODIGO_MEDIO_FACTURACION +
          '/:codigoMedioFacturacion', component: GuardarMediosFacturacionComponent, canDeactivate: [CanDeactivateGuard]
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
export class MediosFacturacionRoutingModule { }
