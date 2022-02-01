import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionNotasRoutingModule } from './gestion-notas-routing.module';
import { GestionNotasComponent } from './gestion-notas.component';
import { NotasAclaratoriasService } from './services/notas-aclaratorias.service';
import { RelacionPlanesService } from './services/relacion-planes.service';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [GestionNotasComponent],
  imports: [
    CommonModule,
    SharedModule,
    GestionNotasRoutingModule
  ],
  providers: [
    NotasAclaratoriasService,
    RelacionPlanesService
  ]
})
export class GestionNotasModule { }
