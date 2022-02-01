import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CanalesVentaMovimientosRoutingModule } from './canales-venta-movimientos-routing.module';
import { ListarCanalesVentaMovimientosComponent } from './listar-canales-venta-movimientos/listar-canales-venta-movimientos.component';
import { GuardarCanalesVentaMovimientosComponent } from './guardar-canales-venta-movimientos/guardar-canales-venta-movimientos.component';
import { CanalesVentaMovimientosComponent } from './canales-venta-movimientos.component';
import { CanalesVentaMovimientosService } from './services/canales-venta-movimientos.service';

@NgModule({
  declarations: [
    CanalesVentaMovimientosComponent,
    ListarCanalesVentaMovimientosComponent,
    GuardarCanalesVentaMovimientosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CanalesVentaMovimientosRoutingModule
  ],
  providers: [
    CanalesVentaMovimientosService
  ]
})
export class CanalesVentaMovimientosModule { }
