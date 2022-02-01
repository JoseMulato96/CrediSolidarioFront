import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActuariaComponent } from './actuaria.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DetalleCargueMasivoComponent } from './configuracion/detalle-cargue-masivo/detalle-cargue-masivo.component';


const routes: Routes = [
  {
    path: '',
    component: ActuariaComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR,
        pathMatch: 'full'
      },
      {
        path: `${UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR}/:codigoPlan`,
        component: ConfiguracionComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR,
        component: ConfiguracionComponent
      },
      {
        path: `${UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR}/:codigoPlan/${UrlRoute.SOLICITUD_APROBACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: ConfiguracionComponent
      },
      {
        path: `${UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR}/${UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR_DETALLE}/:tipoFactor/:codigoCargue`,
        component: DetalleCargueMasivoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActuariaRoutingModule { }
