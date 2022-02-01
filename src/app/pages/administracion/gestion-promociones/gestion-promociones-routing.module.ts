import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionPromocionesComponent } from './gestion-promociones.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: GestionPromocionesComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES,
        pathMatch: 'full'
      },
      {
        path: UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES,
        loadChildren: () => import('./promociones/promociones.module').then(m => m.PromocionesModule)
      },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPromocionesRoutingModule { }
