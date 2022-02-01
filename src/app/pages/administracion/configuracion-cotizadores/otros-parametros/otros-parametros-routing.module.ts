import { NgModule } from '@angular/core';

import { UrlRoute } from '@shared/static/urls/url-route';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { OtrosParametrosComponent } from './otros-parametros.component';
import { ListarOtrosParametrosComponent } from './listar-otros-parametros/listar-otros-parametros.component';
import { GuardarOtrosParametrosComponent } from './guardar-otros-parametros/guardar-otros-parametros.component';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: OtrosParametrosComponent,
    children: [
      {
        path: '',
        component: ListarOtrosParametrosComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS,
        component: ListarOtrosParametrosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS_NUEVO,
        component: GuardarOtrosParametrosComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarOtrosParametrosComponent,
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
export class OtrosParametrosRoutingModule { }
