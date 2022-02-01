import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { AprobacionFinalComponent } from './aprobacion-final.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ResumenComponent } from './configuracion/resumen/resumen.component';

const routes: Routes = [
  {
    path: '',
    component: AprobacionFinalComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR,
        pathMatch: 'full'
      },
      {
        path: `${UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR}/:codigoPlan`,
        component: ConfiguracionComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR,
        component: ConfiguracionComponent
      },
      {
        path: `${UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR}/:codigoPlan/${UrlRoute.SOLICITUD_APROBACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: ConfiguracionComponent
      },
      {
        path: `${UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR}/:codigoPlan/${UrlRoute.SOLICITUD_APROBACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId/${UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR_RESUMEN}`,
        component: ResumenComponent
      }, {
        path: `${UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR}/:codigoPlan/${UrlRoute.SOLICITUD_APROBACION}`,
        component: ResumenComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionFinalRoutingModule { }


