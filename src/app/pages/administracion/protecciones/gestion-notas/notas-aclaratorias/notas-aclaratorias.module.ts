import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotasAclaratoriasRoutingModule } from './notas-aclaratorias-routing.module';
import { GuardarNotasAclaratoriasComponent } from './guardar-notas-aclaratorias/guardar-notas-aclaratorias.component';
import { ListarNotasAclaratoriasComponent } from './listar-notas-aclaratorias/listar-notas-aclaratorias.component';
import { NotasAclaratoriasComponent } from './notas-aclaratorias.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import {EditorModule} from 'primeng/editor';

@NgModule({
  declarations: [NotasAclaratoriasComponent, GuardarNotasAclaratoriasComponent, ListarNotasAclaratoriasComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NotasAclaratoriasRoutingModule,
    EditorModule
  ]
})
export class NotasAclaratoriasModule { }
