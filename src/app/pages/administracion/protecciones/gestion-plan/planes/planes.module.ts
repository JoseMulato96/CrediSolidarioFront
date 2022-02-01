import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanesRoutingModule } from './planes-routing.module';
import { PlanesComponent } from './planes.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarPlanesComponent } from './listar-planes/listar-planes.component';
import { GuardarPlanesComponent } from './guardar-planes/guardar-planes.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [PlanesComponent, ListarPlanesComponent, GuardarPlanesComponent],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    ReactiveFormsModule,
    PlanesRoutingModule
  ]
})
export class PlanesModule { }
