import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AportesEstatutariosComponent } from './aportes-estatutarios.component';
import { ListarAportesEstatutariosComponent } from './listar-aportes-estatutarios/listar-aportes-estatutarios.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarAportesEstatutariosComponent } from './guardar-aportes-estaturarios/guardar-aportes-estatutarios.component';
import { CanDeactivateGuard } from '@core/guards';


const routes: Routes = [
  {
    path: '',
    component: AportesEstatutariosComponent,
    children: [
      {
        path: '',
        component: ListarAportesEstatutariosComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS,
        component: ListarAportesEstatutariosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS_NUEVO,
        component: GuardarAportesEstatutariosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarAportesEstatutariosComponent,
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
export class AportesEstatutariosRoutingModule { }
