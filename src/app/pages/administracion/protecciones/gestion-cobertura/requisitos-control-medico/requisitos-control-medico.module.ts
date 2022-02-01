import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisitosControlMedicoRoutingModule } from './requisitos-control-medico-routing.module';
import { RequisitosControlMedicoComponent } from './requisitos-control-medico.component';
import { GuardarRequisitosContolMedicoComponent } from './guardar-requisitos-contol-medico/guardar-requisitos-contol-medico.component';
import { ListarRequisitosContolMedicoComponent } from './listar-requisitos-contol-medico/listar-requisitos-contol-medico.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequisitosColtrolMedicoService } from './services/requisitos-coltrol-medico.service';

@NgModule({
  declarations: [
    RequisitosControlMedicoComponent,
    GuardarRequisitosContolMedicoComponent,
    ListarRequisitosContolMedicoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RequisitosControlMedicoRoutingModule
  ],
  providers: [
    RequisitosColtrolMedicoService
  ]
})
export class RequisitosControlMedicoModule { }
