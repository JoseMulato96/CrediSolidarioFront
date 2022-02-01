import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { NivelRiesgoPlanComponent } from './nivel-riesgo-plan.component';
import { ListarNivelRiesgoPlanComponent } from './listar-nivel-riesgo-plan/listar-nivel-riesgo-plan.component';
import { GuardarNivelRiesgoPlanComponent } from './guardar-nivel-riesgo-plan/guardar-nivel-riesgo-plan.component';

const routes: Routes = [
  {
    path: '',
    component: NivelRiesgoPlanComponent,
    children: [
      {path: '', component: ListarNivelRiesgoPlanComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_NUEVO, component: GuardarNivelRiesgoPlanComponent, canDeactivate: [CanDeactivateGuard]},
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_PLAN + '/:codigoPlan/' +
        UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_NIVEL_RIESGO + '/:codigoNivelRiesgo',
        component: GuardarNivelRiesgoPlanComponent,
        canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NivelRiesgoPlanRoutingModule { }
