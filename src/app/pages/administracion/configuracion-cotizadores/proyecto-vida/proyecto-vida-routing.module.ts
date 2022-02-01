import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProyectoVidaComponent } from './proyecto-vida.component';
import { ListarProyectoVidaComponent } from './listar-proyecto-vida/listar-proyecto-vida.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarProyectoVidaComponent } from './guardar-proyecto-vida/guardar-proyecto-vida.component';
import { CanDeactivateGuard } from '@core/guards';


const routes: Routes = [
  {
    path: '',
    component: ProyectoVidaComponent,
    children: [
      {
        path: '',
        component: ListarProyectoVidaComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA,
        component: ListarProyectoVidaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA_NUEVO,
        component: GuardarProyectoVidaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarProyectoVidaComponent,
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
export class ProyectoVidaRoutingModule { }
