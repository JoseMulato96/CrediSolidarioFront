import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GestionCampanasComponent } from './gestion-campanas.component';

const routes: Routes = [
  {
    path: '',
    component: GestionCampanasComponent,
    children: [
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS,
        loadChildren: () => import('./campanas/campanas-module.module').then(m => m.CampanasModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_PLAN_COBERTURA,
        loadChildren: () => import('./campanas-cobertura/campanas-cobertura.module').then(m => m.CampanasCoberturaModule)
      }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class GestionCampanasRoutingModule { }
