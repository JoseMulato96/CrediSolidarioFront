import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreexistenciasComponent } from './preexistencias.component';
import { IngresarPreexistenciaComponent } from './ingresar-preexistencia/ingresar-preexistencia.component';
import { SharedModule } from '@shared/shared.module';
import { PreexistenciasRoutingModule } from './preexistencia-routing.module';
import { ActualizarPreexistenciaComponent } from './actualizar-preexistencia/actualizar-preexistencia.component';
import { HistoricoPreexistenciaComponent } from './historico-preexistencia/historico-preexistencia.component';
import { ActualizarImcComponent } from './actualizar-imc/actualizar-imc.component';

@NgModule({
  declarations: [
    PreexistenciasComponent,
    IngresarPreexistenciaComponent,
    ActualizarPreexistenciaComponent,
    HistoricoPreexistenciaComponent,
    ActualizarImcComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PreexistenciasRoutingModule
  ]
})
export class PreexistenciasModule {}
