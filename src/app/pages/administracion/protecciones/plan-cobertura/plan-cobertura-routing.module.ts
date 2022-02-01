import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard, CanActivateValidatorStatusPlanGuard } from '@core/guards';
import { ListarPlanCoberturaComponent } from './listar-plan-cobertura/listar-plan-cobertura.component';
import { GuardarPlanCoberturaComponent } from './guardar-plan-cobertura/guardar-plan-cobertura.component';
import { PlanCoberturaComponent } from './plan-cobertura.component';
import { ListarPlanComponent } from './listar-plan-cobertura/listar-plan.component';

const routes: Routes = [
  {
    path: '',
    component: PlanCoberturaComponent,
    children: [
      // Listar planes
      { path: '', component: ListarPlanComponent },
      // Listar planCobertura,2
      {
        path: `${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan`,
        component: ListarPlanCoberturaComponent,
        canActivate: [CanActivateValidatorStatusPlanGuard]
      },
      // Crear - Editar planCobertura 4
      {
        path: `${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan/${UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA}/:codigoCobertura`,
        component: GuardarPlanCoberturaComponent
      },

      /* Para solicitar la eliminación 5*/
      {
        path: `${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan/${UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA}/:codigoCobertura/:solicitud`,
        component: GuardarPlanCoberturaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      /* Para gestionar la aprobacion o rechazo de la solicitud de elimnación 9*/
      {
        path: `${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan/${UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA}/:codigoCobertura/${UrlRoute.SOLICITUD_ELIMINACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GuardarPlanCoberturaComponent,
        canDeactivate: [CanDeactivateGuard]
      },

      /* Para solicitar la creación 3*/
      {
        path: `${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan/:solicitud`,
        component: ListarPlanCoberturaComponent
      },
      /* Para gestionar la aprobacion o rechazo de la solicitud de creación 7*/
      {
        path: `${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan/${UrlRoute.SOLICITUD_APROBACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: ListarPlanCoberturaComponent
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
export class PlanCoberturaRoutingModule { }
