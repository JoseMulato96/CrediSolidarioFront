import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { PromocionesComponent } from './promociones.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarPromocionesComponent } from './listar-promociones/listar-promociones.component';
import { GuardarPromocionesComponent } from './guardar-promociones/guardar-promociones.component';
import { CanDeactivateGuard } from '@core/guards';


const routes: Routes = [
  {
    path: '',
    component: PromocionesComponent,
    children: [
      {
        path: '',
        component: ListarPromocionesComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES,
        component: ListarPromocionesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES_NUEVO,
        component: GuardarPromocionesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarPromocionesComponent,
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
export class PromocionesRoutingModule { }
