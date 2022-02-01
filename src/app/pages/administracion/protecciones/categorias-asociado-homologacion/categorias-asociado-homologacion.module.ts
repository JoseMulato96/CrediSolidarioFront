import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { CategoriasAsociadoHomologacionRoutingModule } from './categorias-asociado-homologacion-routing.module';
import { CategoriasAsociadoHomologacionComponent } from './categorias-asociado-homologacion.component';
import { CrearCategoriasAsociadoHomologacionComponent } from './crear-categorias-asociado-homologacion/crear-categorias-asociado-homologacion.component';
import { ListarCategoriasAsociadoHomologacionComponent } from './listar-categorias-asociado-homologacion/listar-categorias-asociado-homologacion.component';


@NgModule({
  declarations: [CategoriasAsociadoHomologacionComponent, CrearCategoriasAsociadoHomologacionComponent, ListarCategoriasAsociadoHomologacionComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CategoriasAsociadoHomologacionRoutingModule
  ]
})
export class CategoriasAsociadoHomologacionModule { }
