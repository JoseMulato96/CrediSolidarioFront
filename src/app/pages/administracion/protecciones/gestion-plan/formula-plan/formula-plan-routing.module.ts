import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { FormulaPlanComponent } from './formula-plan.component';
import { ListarFormulaPlanComponent } from './listar-formula-plan/listar-formula-plan.component';
import { GuardarFormulaPlanComponent } from './guardar-formula-plan/guardar-formula-plan.component';

const routes: Routes = [
  {
    path: '',
    component: FormulaPlanComponent,
    children: [
      {path: '', component: ListarFormulaPlanComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN_NUEVO, component: GuardarFormulaPlanComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigoFormulaPlan', component: GuardarFormulaPlanComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FormulaPlanRoutingModule { }
