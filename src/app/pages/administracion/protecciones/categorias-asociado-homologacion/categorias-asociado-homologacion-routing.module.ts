import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasAsociadoHomologacionComponent } from './categorias-asociado-homologacion.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ListarCategoriasAsociadoHomologacionComponent } from './listar-categorias-asociado-homologacion/listar-categorias-asociado-homologacion.component';
import { CrearCategoriasAsociadoHomologacionComponent } from './crear-categorias-asociado-homologacion/crear-categorias-asociado-homologacion.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: CategoriasAsociadoHomologacionComponent,
    children: [
      {
        path: '',
        component: ListarCategoriasAsociadoHomologacionComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION_NUEVO,
        component: CrearCategoriasAsociadoHomologacionComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: CrearCategoriasAsociadoHomologacionComponent,
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasAsociadoHomologacionRoutingModule { }
