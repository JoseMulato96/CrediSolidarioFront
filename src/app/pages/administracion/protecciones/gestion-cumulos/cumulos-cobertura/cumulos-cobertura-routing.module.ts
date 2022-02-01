import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CumulosCoberturaComponent } from './cumulos-cobertura.component';
import { ListarCumulosCoberturaComponent } from './listar-cumulos-cobertura/listar-cumulos-cobertura.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarCumulosCoberturaComponent } from './guardar-cumulos-cobertura/guardar-cumulos-cobertura.component';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: CumulosCoberturaComponent,
    children: [
      {path: '', component: ListarCumulosCoberturaComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA_NUEVO, component: GuardarCumulosCoberturaComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigoCobertura/:codigoCumulo/:codigoFondo', component: GuardarCumulosCoberturaComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CumulosCoberturaRoutingModule { }
