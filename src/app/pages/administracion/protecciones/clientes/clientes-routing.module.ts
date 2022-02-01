import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ListarClientesComponent } from './listar-clientes/listar-clientes.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarClienteComponent } from './guardar-cliente/guardar-cliente.component';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: ClientesComponent,
    children: [
      {
        path: '',
        component: ListarClientesComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES_NUEVO,
        component: GuardarClienteComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarClienteComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `:codigo/:solicitud`,
        component: GuardarClienteComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path:  `:codigo/${UrlRoute.SOLICITUD_ELIMINACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GuardarClienteComponent,
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
export class ClientesRoutingModule { }
