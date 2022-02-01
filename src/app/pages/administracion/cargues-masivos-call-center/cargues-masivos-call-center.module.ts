import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarguesMasivosCallCenterRoutingModule } from './cargues-masivos-call-center-routing.module';
import { ListarCarguesMasivosCallCenterComponent } from './listar-cargues-masivos-call-center/listar-cargues-masivos-call-center.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GestionDetalladaOperacionesComponent } from './gestion-detallada-operaciones/gestion-detallada-operaciones.component';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [ListarCarguesMasivosCallCenterComponent, GestionDetalladaOperacionesComponent],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    ReactiveFormsModule,
    CarguesMasivosCallCenterRoutingModule
  ]
})
export class CarguesMasivosCallCenterModule { }
