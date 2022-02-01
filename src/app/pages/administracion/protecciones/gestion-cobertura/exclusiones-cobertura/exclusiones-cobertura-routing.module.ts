import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ListarExclusionesCoberturaComponent } from './listar-exclusiones-cobertura/listar-exclusiones-cobertura.component';
import { GuardarExclusionesCoberturaComponent } from './guardar-exclusiones-cobertura/guardar-exclusiones-cobertura.component';
import { ExclusionesCoberturaComponent } from './exclusiones-cobertura.component';

const routes: Routes = [
  {
    path: '',
    component: ExclusionesCoberturaComponent,
    children: [
      {path: '', component: ListarExclusionesCoberturaComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_ESCLUSIONES_NUEVO, component: GuardarExclusionesCoberturaComponent, canDeactivate: [CanDeactivateGuard]},
      {path: UrlRoute. ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_CODIGO_EXCLUSION + '/:codigoExclusion/' +
             UrlRoute. ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_CODIGO_COBERTURA + '/:codigoCobertura/' +
             UrlRoute. ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_CODIGO_FONDO + '/:codigoFondo',
             component: GuardarExclusionesCoberturaComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExclusionesCoberturaRoutingModule { }
