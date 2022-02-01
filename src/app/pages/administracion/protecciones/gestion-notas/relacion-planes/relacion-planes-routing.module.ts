import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RelacionPlanesComponent } from './relacion-planes.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarRelacionPlanesComponent } from './listar-relacion-planes/listar-relacion-planes.component';
import { GuardarRelacionPlanesComponent } from './guardar-relacion-planes/guardar-relacion-planes.component';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: RelacionPlanesComponent,
    children: [
      {
        path: '',
        component: ListarRelacionPlanesComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_RELACION_PLANES_NUEVO,
        component: GuardarRelacionPlanesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarRelacionPlanesComponent,
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
export class RelacionPlanesRoutingModule { }
