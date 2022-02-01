import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionGestionDiariaComponent } from './asignacion-gestion-diaria.component';
import { ListarAsignacionGestionDiariaComponent } from './listar-asignacion-gestion-diaria/listar-asignacion-gestion-diaria.component';

const routes: Routes = [
  {
    path: '',
    component: AsignacionGestionDiariaComponent,
    children: [
      {
        path: '',
        component: ListarAsignacionGestionDiariaComponent
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
export class AsignacionGestionDiariaRoutingModule { }
