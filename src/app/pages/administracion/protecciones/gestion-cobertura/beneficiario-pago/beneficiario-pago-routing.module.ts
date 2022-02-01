import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from '@core/guards';
import { BeneficiarioPagoComponent } from './beneficiario-pago.component';
import { ListarBeneficiarioPagoComponent } from './listar-beneficiario-pago/listar-beneficiario-pago.component';
import { GuardarBeneficiarioPagoComponent } from './guardar-beneficiario-pago/guardar-beneficiario-pago.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: BeneficiarioPagoComponent,
    children: [
      {
        path: '',
        component: ListarBeneficiarioPagoComponent
      },
      {
        path: ':codigo',
        component: GuardarBeneficiarioPagoComponent,
        canDeactivate: [CanDeactivateGuard]
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
export class BeneficiarioPagoRoutingModule { }
