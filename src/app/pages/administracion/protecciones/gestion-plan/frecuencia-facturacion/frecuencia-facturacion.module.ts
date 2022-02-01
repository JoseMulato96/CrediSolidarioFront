import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { FrecuenciaFacturacionRoutingModule } from './frecuencia-facturacion-routing.module';
import { FrecuenciaFacturacionComponent } from './frecuencia-facturacion.component';
import { GuardarFrecuenciaFacturacionComponent } from './guardar-frecuencia-facturacion/guardar-frecuencia-facturacion.component';
import { ListarFrecuenciaFacturacionComponent } from './listar-frecuencia-facturacion/listar-frecuencia-facturacion.component';
import { FrecuenciaFacturacionPlanService } from './services/frecuencia-facturacion-plan.service';


@NgModule({
  declarations: [
    FrecuenciaFacturacionComponent,
    ListarFrecuenciaFacturacionComponent,
    GuardarFrecuenciaFacturacionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FrecuenciaFacturacionRoutingModule
  ],
  providers: [
    FrecuenciaFacturacionPlanService
  ]
})
export class FrecuenciaFacturacionModule { }
