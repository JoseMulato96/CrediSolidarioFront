import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesosAutomaticosRoutingModule } from './procesos-automaticos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ProcesosAutomaticosComponent } from './procesos-automaticos.component';
import { CrearProcesosAutomaticosComponent } from './crear-procesos-automaticos/crear-procesos-automaticos.component';
import { ListarProcesosAutomaticosComponent } from './listar-procesos-automaticos/listar-procesos-automaticos.component';

@NgModule({
  declarations: [ProcesosAutomaticosComponent, CrearProcesosAutomaticosComponent, ListarProcesosAutomaticosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ProcesosAutomaticosRoutingModule
  ]
})
export class ProcesosAutomaticosModule { }
