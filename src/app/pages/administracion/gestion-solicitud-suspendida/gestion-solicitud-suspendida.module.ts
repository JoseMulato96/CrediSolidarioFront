import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionSolicitudSuspendidaRoutingModule } from './gestion-solicitud-suspendida-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GestionSolicitudSuspendidaComponent } from './gestion-solicitud-suspendida.component';
import { ListarGestionSolicitudSuspendidaComponent } from './listar-gestion-solicitud-suspendida/listar-gestion-solicitud-suspendida.component';

@NgModule({
  declarations: [GestionSolicitudSuspendidaComponent, ListarGestionSolicitudSuspendidaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GestionSolicitudSuspendidaRoutingModule
  ]
})
export class GestionSolicitudSuspendidaModule { }
