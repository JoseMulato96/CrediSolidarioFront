import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { SimulacionesRoutingModule } from './simulaciones-routing.module';
import { SimulacionesComponent } from './simulaciones.component';
import { ValorDevolverComponent } from './valor-devolver/valor-devolver.component';
import { ValorDevolverCancelacionComponent } from './valor-devolver-cancelacion/valor-devolver-cancelacion.component';

@NgModule({
  declarations: [
    SimulacionesComponent,
    ValorDevolverComponent,
    ValorDevolverCancelacionComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SimulacionesRoutingModule
  ]
})
export class SimulacionesModule { }
