import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancieraComponent } from './financiera.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ConfiguracionComponent } from '../financiera/configuracion/configuracion.component';


const routes: Routes = [
  {
    path: '',
    component: FinancieraComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_FINANCIERA_CONFIGURAR,
        pathMatch: 'full'
      },
      {
        path: `${UrlRoute.ADMINISTRACION_FINANCIERA_CONFIGURAR}/:codigoPlan`,
        component: ConfiguracionComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_FINANCIERA_CONFIGURAR,
        component: ConfiguracionComponent
      },
      {
        path: `${UrlRoute.ADMINISTRACION_FINANCIERA_CONFIGURAR}/:codigoPlan/${UrlRoute.SOLICITUD_APROBACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: ConfiguracionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancieraRoutingModule { }
