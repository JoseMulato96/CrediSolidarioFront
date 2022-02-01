import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasAsociadoComponent } from './categorias-asociado.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ListarCategoriasAsociadoComponent } from './listar-categorias-asociado/listar-categorias-asociado.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CrearCategoriasAsociadoComponent } from './crear-categorias-asociado/crear-categorias-asociado.component';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: CategoriasAsociadoComponent,
    children: [
      {
        path: '',
        component: ListarCategoriasAsociadoComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_NUEVO,
        component: CrearCategoriasAsociadoComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: CrearCategoriasAsociadoComponent,
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasAsociadoRoutingModule { }
