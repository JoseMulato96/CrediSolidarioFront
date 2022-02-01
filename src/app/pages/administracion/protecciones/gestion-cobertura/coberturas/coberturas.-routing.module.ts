import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { CoberturasComponent } from './coberturas.component';
import { ListarCoberturasComponent } from './listar-coberturas/listar-coberturas.component';
import { GuardarCoberturasComponent } from './guardar-coberturas/guardar-coberturas.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: CoberturasComponent,
    children: [
      {
        path: '',
        component: ListarCoberturasComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS_NUEVO,
        component: GuardarCoberturasComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigoCobertura',
        component: GuardarCoberturasComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigoCobertura/:solicitud',
        component: GuardarCoberturasComponent
      },
      {
        path: `:codigoCobertura/${UrlRoute.SOLICITUD_ELIMINACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GuardarCoberturasComponent
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
export class CoberturasRoutingModule { }
