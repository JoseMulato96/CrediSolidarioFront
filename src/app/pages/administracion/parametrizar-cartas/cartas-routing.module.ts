import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartasComponent } from './cartas.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ListarCartasComponent } from './listar-cartas/listar-cartas.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarCartaComponent } from './guardar-carta/guardar-carta.component';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: CartasComponent,
    children: [
      {
        path: '',
        component: ListarCartasComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PARAMETRIZAR_CARTAS_NUEVO,
        component: GuardarCartaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarCartaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo/:solicitud',
        component: GuardarCartaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo/:proceso/:solicitud',
        component: GuardarCartaComponent,
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
export class CartasRoutingModule { }
