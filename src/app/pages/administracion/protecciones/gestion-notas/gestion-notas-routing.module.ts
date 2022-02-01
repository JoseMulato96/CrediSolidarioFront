import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GestionNotasComponent } from './gestion-notas.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: GestionNotasComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS,
        pathMatch: 'full'
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS,
        loadChildren: () => import('./notas-aclaratorias/notas-aclaratorias.module').then(m => m.NotasAclaratoriasModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_RELACION_PLANES,
        loadChildren: () => import('./relacion-planes/relacion-planes.module').then(m => m.RelacionPlanesModule)
      },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionNotasRoutingModule { }
