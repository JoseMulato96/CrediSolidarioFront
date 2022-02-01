import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequisitosControlMedicoComponent } from './requisitos-control-medico.component';
import { ListarRequisitosContolMedicoComponent } from './listar-requisitos-contol-medico/listar-requisitos-contol-medico.component';
import { GuardarRequisitosContolMedicoComponent } from './guardar-requisitos-contol-medico/guardar-requisitos-contol-medico.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: RequisitosControlMedicoComponent,
    children: [
      {path: '', component: ListarRequisitosContolMedicoComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_REQUISITOS_CONTROL_MEDICO_NUEVO, component: GuardarRequisitosContolMedicoComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `:codigo`, component: GuardarRequisitosContolMedicoComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisitosControlMedicoRoutingModule { }
