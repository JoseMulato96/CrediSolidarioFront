import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { CarguesMasivosCallCenterComponent } from './cargues-masivos-call-center.component';
import { ListarCarguesMasivosCallCenterComponent } from './listar-cargues-masivos-call-center/listar-cargues-masivos-call-center.component';
import { GestionDetalladaOperacionesComponent } from './gestion-detallada-operaciones/gestion-detallada-operaciones.component';

const routes: Routes = [
  {
    path: '',
    component: CarguesMasivosCallCenterComponent,
    children: [
      {
        path: '',
        component: ListarCarguesMasivosCallCenterComponent
      },
      {
        path: ':codigo',
        component: GestionDetalladaOperacionesComponent
      },
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarguesMasivosCallCenterRoutingModule { }
