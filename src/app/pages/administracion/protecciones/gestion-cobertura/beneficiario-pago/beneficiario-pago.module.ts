import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiarioPagoComponent } from './beneficiario-pago.component';
import { ListarBeneficiarioPagoComponent } from './listar-beneficiario-pago/listar-beneficiario-pago.component';
import { GuardarBeneficiarioPagoComponent } from './guardar-beneficiario-pago/guardar-beneficiario-pago.component';

import { ReactiveFormsModule } from '@angular/forms';
import { BeneficiarioPagoRoutingModule } from './beneficiario-pago-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    BeneficiarioPagoComponent,
    ListarBeneficiarioPagoComponent,
    GuardarBeneficiarioPagoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    BeneficiarioPagoRoutingModule
  ]
})
export class BeneficiarioPagoModule { }
