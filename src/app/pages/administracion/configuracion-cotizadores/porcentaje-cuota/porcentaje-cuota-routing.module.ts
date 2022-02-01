import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { PorcentajeCuotaComponent } from './porcentaje-cuota.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarPorcentajeCuotasComponent } from './listar-porcentaje-cuotas/listar-porcentaje-cuotas.component';
import { GuardarPorcentajeCuotasComponent } from './guardar-porcentaje-cuotas/guardar-porcentaje-cuotas.component';
import { CanDeactivateGuard } from '@core/guards';


const routes: Routes = [
  {
    path: '',
    component: PorcentajeCuotaComponent,
    children: [
      {
        path: '',
        component: ListarPorcentajeCuotasComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA,
        component: ListarPorcentajeCuotasComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA_NUEVO,
        component: GuardarPorcentajeCuotasComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigo',
        component: GuardarPorcentajeCuotasComponent,
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
export class PorcentajeCuotaRoutingModule { }
