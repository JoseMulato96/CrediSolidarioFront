import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultasRoutingModule } from './consultas-routing.module';
import { ConsultaLogTransaccionalComponent } from './consulta-log-transaccional/consulta-log-transaccional.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ConsultasComponent } from './consultas.component';
import { ConsultaAsociadosComponent } from './consulta-asociados/consulta-asociados.component';
import { ConsultaPagosComponent } from './contulta-pagos/consulta-pagos.component';

@NgModule({
  declarations: [
    ConsultasComponent,
    ConsultaLogTransaccionalComponent,
    ConsultaAsociadosComponent,
    ConsultaPagosComponent
  ],
  exports: [
    ConsultaLogTransaccionalComponent,
    ConsultaPagosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ConsultasRoutingModule
  ]
})
export class ConsultasModule { }
