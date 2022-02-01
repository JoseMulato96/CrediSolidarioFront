import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasAsociadoRoutingModule } from './categorias-asociado-routing.module';
import { CategoriasAsociadoComponent } from './categorias-asociado.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarCategoriasAsociadoComponent } from './listar-categorias-asociado/listar-categorias-asociado.component';
import { CrearCategoriasAsociadoComponent } from './crear-categorias-asociado/crear-categorias-asociado.component';

@NgModule({
  declarations: [CategoriasAsociadoComponent, ListarCategoriasAsociadoComponent, CrearCategoriasAsociadoComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CategoriasAsociadoRoutingModule
  ],
})
export class CategoriasAsociadoModule { }
