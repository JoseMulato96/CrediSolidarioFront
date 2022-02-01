import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AprobacionFinalRoutingModule } from './aprobacion-final-routing.module';
import { AprobacionFinalComponent } from './aprobacion-final.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ResumenComponent } from './configuracion/resumen/resumen.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AprobacionFinalComponent,
    ConfiguracionComponent,
    ResumenComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AprobacionFinalRoutingModule
  ]
})
export class AprobacionFinalModule { }
