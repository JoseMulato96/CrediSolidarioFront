import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ConsultaRelacionMaestrosComponent } from './plan-cobertura/consulta-relacion-maestros/consulta-relacion-maestros.component';
import { ProteccionesRoutingModule } from './protecciones-routing.module';
import { ProteccionesComponent } from './protecciones.component';


@NgModule({
  declarations: [ProteccionesComponent, ConsultaRelacionMaestrosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ProteccionesRoutingModule
  ]
})
export class ProteccionesModule { }
