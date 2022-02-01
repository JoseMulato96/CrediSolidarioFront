import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancieraRoutingModule } from './financiera-routing.module';
import { FinancieraComponent } from './financiera.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MaestroCuentasComponent } from './configuracion/maestro-cuentas/maestro-cuentas.component';
import { MaestroUsoLocalComponent } from './configuracion/maestro-uso-local/maestro-uso-local.component';
import { RelacionConceptosDistribucionCuentaComponent } from './configuracion/relacion-conceptos-distribucion-cuenta/relacion-conceptos-distribucion-cuenta.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FinancieraComponent,
    ConfiguracionComponent,
    MaestroCuentasComponent,
    MaestroUsoLocalComponent,
    RelacionConceptosDistribucionCuentaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FinancieraRoutingModule
  ]
})
export class FinancieraModule { }
