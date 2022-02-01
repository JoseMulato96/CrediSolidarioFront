import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarControlCumulosComponent } from './guardar-control-cumulos/guardar-control-cumulos.component';
import { ListarControlCumuloComponent } from './listar-control-cumulos/listar-control-cumulos.component';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  { path: '', component: ListarControlCumuloComponent },
  { path: UrlRoute.ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS_NUEVO, component: GuardarControlCumulosComponent, canDeactivate: [CanDeactivateGuard] },
  { path: `:codigo`, component: GuardarControlCumulosComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlCumulosRoutingModule { }
