import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarNivelesRiesgoCoberturaComponent } from './listar-niveles-riesgo-cobertura/listar-niveles-riesgo-cobertura.component';
import { NivelesRiesgoCoberturaComponent } from './niveles-riesgo-cobertura.component';
import { CanDeactivateGuard } from '@core/guards';
import { GuardarNivelesRiesgoCoberturaComponent } from './guardar-niveles-riesgo-cobertura/guardar-niveles-riesgo-cobertura.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';

const routes: Routes = [
  {
    path: '',
    component: NivelesRiesgoCoberturaComponent,
    children: [
      {
        path: '',
        component: ListarNivelesRiesgoCoberturaComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA_NUEVO,
        component: GuardarNivelesRiesgoCoberturaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':codigoNivelRiesgo/:codigoCobertura',
        component: GuardarNivelesRiesgoCoberturaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NivelesRiesgoCoberturaRoutingModule { }
