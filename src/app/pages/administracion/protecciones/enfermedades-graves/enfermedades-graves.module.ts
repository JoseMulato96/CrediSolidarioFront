import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EnfermedadesGravesRoutingModule } from './enfermedades-graves-routing.module';
import { EnfermedadesGravesComponent } from './enfermedades-graves.component';
import { GuardarEnfermedadesGravesComponent } from './guardar-enfermedades-graves/guardar-enfermedades-graves.component';
import { ListarEnfermedadesGravesComponent } from './listar-enfermedades-graves/listar-enfermedades-graves.component';

@NgModule({
    declarations: [
      EnfermedadesGravesComponent,
      GuardarEnfermedadesGravesComponent,
      ListarEnfermedadesGravesComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      EnfermedadesGravesRoutingModule
    ],
    providers: [
    ]
  })

  export class EnfermedadesGravesModule {}
