import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ConsultaLiquidacionesComponent } from './consulta-liquidaciones/consulta-liquidaciones.component';
import { DetalleLiquidacionComponent } from './consulta-liquidaciones/detalle-liquidacion/detalle-liquidacion.component';
import { LiquidacionesComponent } from './liquidaciones.component';
import { LiquidacionesRoutingModule } from './liquidaciones-routing.module';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';

@NgModule({
  imports: [
    CommonModule,
    LiquidacionesRoutingModule,
    SharedModule
  ],
  declarations: [
    LiquidacionesComponent,
    ConsultaLiquidacionesComponent,
    DetalleLiquidacionComponent,
    LiquidacionComponent
  ]
})
export class LiquidacionesModule { }
