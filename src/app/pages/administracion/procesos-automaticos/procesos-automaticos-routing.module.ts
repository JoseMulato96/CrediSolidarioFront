import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { CanDeactivateGuard } from '@core/guards';
import { ProcesosAutomaticosComponent } from './procesos-automaticos.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarProcesosAutomaticosComponent } from './listar-procesos-automaticos/listar-procesos-automaticos.component';
import { CrearProcesosAutomaticosComponent } from './crear-procesos-automaticos/crear-procesos-automaticos.component';


const routes: Routes = [
  {
    path: '',
    component: ProcesosAutomaticosComponent,
    children: [
      {
        path: '',
        component: ListarProcesosAutomaticosComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROCESOS_AUTOMATICOS_NUEVO,
        component: CrearProcesosAutomaticosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':jobName/:jobGroup',
        component: CrearProcesosAutomaticosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosAutomaticosRoutingModule { }
