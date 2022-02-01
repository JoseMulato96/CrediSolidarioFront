import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { NotasAclaratoriasComponent } from './notas-aclaratorias.component';
import { ListarNotasAclaratoriasComponent } from './listar-notas-aclaratorias/listar-notas-aclaratorias.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { GuardarNotasAclaratoriasComponent } from './guardar-notas-aclaratorias/guardar-notas-aclaratorias.component';
import { CanDeactivateGuard } from '@core/guards';


const routes: Routes = [
  {
    path: '',
    component: NotasAclaratoriasComponent,
    children: [
      {
        path: '',
        component: ListarNotasAclaratoriasComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS_NUEVO,
        component: GuardarNotasAclaratoriasComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarNotasAclaratoriasComponent,
        canDeactivate: [CanDeactivateGuard]
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
export class NotasAclaratoriasRoutingModule { }
