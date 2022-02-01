import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CumulosComponent } from './cumulos.component';
import { ListarCumulosComponent } from './listar-cumulos/listar-cumulos.component';
import { GuardarCumulosComponent } from './guardar-cumulos/guardar-cumulos.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: CumulosComponent,
    children: [
      {path: '', component: ListarCumulosComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_FONDO_NUEVO, component: GuardarCumulosComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigo', component: GuardarCumulosComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CumulosRoutingModule { }
