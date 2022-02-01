import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ReportesComponent } from './reportes.component';
import { GestionDiariaComponent } from './gestion-diaria/gestion-diaria.component';
import { AutomaticoPagosComponent } from './automatico-pagos/automatico-pagos.component';
import { NotificacionCierreComponent } from './notificacion-cierre/notificacion-cierre.component';
import { ProcesosAutomaticosComponent } from './procesos-automaticos/procesos-automaticos.component';
import { AmparosPagadosComponent } from './amparos-pagados/amparos-pagados.component';



const routes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    children: [
      {
        path: UrlRoute.REPORTES_CARTAS,
        loadChildren: () => import('./cartas/cartas.module').then(m => m.CartasModule)
      }
    ]
  },
  {
    path: UrlRoute.REPORTES_GESTION_DIARIA,
    component: GestionDiariaComponent
  },
  {
    path: UrlRoute.REPORTES_AUTOMATICO_PAGOS,
    component: AutomaticoPagosComponent
  },
  {
    path: UrlRoute.REPORTES_NOTIFICACION_CIERRE,
    component: NotificacionCierreComponent
  },
  {
    path: UrlRoute.REPORTES_PROCESOS_AUTOMATICOS,
    component: ProcesosAutomaticosComponent
  },
  {
    path: UrlRoute.REPORTES_AMPAROS_PAGADOS,
    component: AmparosPagadosComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
