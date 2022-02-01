import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignacionGestionDiariaBetaComponent } from './asignacion-gestion-diaria-beta.component';
import { ListarAsignacionGestionDiariaBetaComponent } from './listar-asignacion-gestion-diaria-beta/listar-asignacion-gestion-diaria-beta.component';


const routes: Routes = [
  {
    path: '',
    component: AsignacionGestionDiariaBetaComponent,
    children: [
      {
        path: '',
        component: ListarAsignacionGestionDiariaBetaComponent
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
export class AsignacionGestionDiariaBetaRoutingModule { }
