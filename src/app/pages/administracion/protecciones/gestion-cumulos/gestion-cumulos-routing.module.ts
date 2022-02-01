import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GestionCumulosComponent } from './gestion-cumulos.component';

const routes: Routes = [
  {
    path: '',
    component: GestionCumulosComponent,
    children: [
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS,
        loadChildren: () => import('./cumulos/cumulos.module').then(m => m.CumulosModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA,
        loadChildren: () => import('./cumulos-cobertura/cumulos-cobertura.module').then(m => m.CumulosCoberturaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS,
        loadChildren: () => import('./control-cumulos/control-cumulos.module').then(m => m.ControlCumulosModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCumulosRoutingModule { }
