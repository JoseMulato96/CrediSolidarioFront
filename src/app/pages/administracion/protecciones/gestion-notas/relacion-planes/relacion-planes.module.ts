import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelacionPlanesRoutingModule } from './relacion-planes-routing.module';
import { RelacionPlanesComponent } from './relacion-planes.component';
import { ListarRelacionPlanesComponent } from './listar-relacion-planes/listar-relacion-planes.component';
import { GuardarRelacionPlanesComponent } from './guardar-relacion-planes/guardar-relacion-planes.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RelacionPlanesComponent, ListarRelacionPlanesComponent, GuardarRelacionPlanesComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RelacionPlanesRoutingModule
  ]
})
export class RelacionPlanesModule { }
