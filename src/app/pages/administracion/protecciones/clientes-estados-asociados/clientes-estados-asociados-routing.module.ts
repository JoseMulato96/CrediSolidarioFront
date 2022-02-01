import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesEstadosAsociadosComponent } from './clientes-estados-asociados.component';
import { ListarClientesEstadosAsociadosComponent } from './listar-clientes-estados-asociados/listar-clientes-estados-asociados.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarClientesEstadosAsociadosComponent } from './guardar-clientes-estados-asociados/guardar-clientes-estados-asociados.component';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesEstadosAsociadosComponent,
    children: [
      {path: '', component: ListarClientesEstadosAsociadosComponent},
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO_NUEVO,
        component: GuardarClientesEstadosAsociadosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `:codigo`,
        component: GuardarClientesEstadosAsociadosComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesEstadosAsociadosRoutingModule { }
