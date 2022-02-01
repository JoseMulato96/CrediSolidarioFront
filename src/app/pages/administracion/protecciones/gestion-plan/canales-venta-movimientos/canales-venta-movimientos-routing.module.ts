import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanalesVentaMovimientosComponent } from './canales-venta-movimientos.component';
import { GuardarCanalesVentaMovimientosComponent } from './guardar-canales-venta-movimientos/guardar-canales-venta-movimientos.component';
import { ListarCanalesVentaMovimientosComponent } from './listar-canales-venta-movimientos/listar-canales-venta-movimientos.component';

const routes: Routes = [
  {
    path: '',
    component: CanalesVentaMovimientosComponent,
    children: [
      { path: '', component: ListarCanalesVentaMovimientosComponent },
      { path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CANAL_VENTAS_MOVIMIENTO_NUEVO, component: GuardarCanalesVentaMovimientosComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'codigoPlan/:codigoPlan/codigoCanalVenta/:codigoCanalVenta', component: GuardarCanalesVentaMovimientosComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanalesVentaMovimientosRoutingModule { }
