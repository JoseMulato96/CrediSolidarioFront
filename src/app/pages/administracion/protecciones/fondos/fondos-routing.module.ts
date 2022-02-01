import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FondosComponent } from './fondos.component';
import { ListarFondosComponent } from './listar-fondos/listar-fondos.component';
import { GuardarFondosComponent } from './guardar-fondos/guardar-fondos.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: FondosComponent,
    children: [
      {path: '', component: ListarFondosComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_FONDO_NUEVO, component: GuardarFondosComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `:codigo`, component: GuardarFondosComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FondosRoutingModule { }
