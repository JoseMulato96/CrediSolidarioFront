import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionSolicitudSuspendidaComponent } from './gestion-solicitud-suspendida.component';
import { ListarGestionSolicitudSuspendidaComponent } from './listar-gestion-solicitud-suspendida/listar-gestion-solicitud-suspendida.component';


const routes: Routes = [
  {
    path: '',
    component: GestionSolicitudSuspendidaComponent,
    children: [
      {
        path: '',
        component: ListarGestionSolicitudSuspendidaComponent
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionSolicitudSuspendidaRoutingModule { }
